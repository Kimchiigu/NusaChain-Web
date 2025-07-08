import pandas as pd
import numpy as np
import os
import pickle
import time
from dotenv import load_dotenv
from etherscan import Etherscan
from web3 import Web3
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.impute import SimpleImputer
from flask import Flask, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
load_dotenv()
ETHERSCAN_API_KEY = os.getenv('ETHERSCAN_API_KEY')
INFURA_PROJECT_ID = os.getenv('INFURA_PROJECT_ID')

# Initialize Etherscan and Web3
eth = Etherscan(ETHERSCAN_API_KEY)
w3 = Web3(Web3.HTTPProvider(f'https://mainnet.infura.io/v3/{INFURA_PROJECT_ID}'))

# Load Kaggle dataset
KAGGLE_DATA_PATH = './transaction_dataset.csv'

def fetch_scam_addresses(dataset_df):
    """Fetch scam addresses from the dataset where FLAG is 1."""
    scam_addresses = dataset_df[dataset_df['FLAG'] == 1]['Address'].tolist()
    logging.info(f"Fetched {len(scam_addresses)} scam addresses from dataset")
    return scam_addresses

def fetch_legit_addresses(dataset_df):
    """Fetch legitimate addresses from the dataset where FLAG is 0, with fallback."""
    legit_addresses = dataset_df[dataset_df['FLAG'] == 0]['Address'].tolist()
    if not legit_addresses:
        legit_addresses = [
            '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',  # Uniswap V2 Router
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',  # WETH
            '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'   # Chainlink
        ]
        logging.info(f"No legitimate addresses in CSV. Using {len(legit_addresses)} fallback addresses")
    else:
        logging.info(f"Fetched {len(legit_addresses)} legitimate addresses from dataset")
    return legit_addresses

def get_contract_transactions(contract_address, start_block=0, end_block=99999999):
    """Fetch transactions with caching."""
    cache_file = f"cache/transactions_{contract_address}.pkl"
    if os.path.exists(cache_file):
        with open(cache_file, 'rb') as f:
            logging.info(f"Loaded cached transactions for {contract_address}")
            return pickle.load(f)
    max_retries = 3
    retry_delay = 2
    for attempt in range(max_retries):
        try:
            transactions = eth.get_normal_txs_by_address(
                address=contract_address,
                startblock=start_block,
                endblock=end_block,
                sort="asc"
            )
            tx_df = pd.DataFrame(transactions)
            logging.info(f"Fetched {len(tx_df)} transactions from Etherscan for {contract_address}")
            os.makedirs("cache", exist_ok=True)
            with open(cache_file, 'wb') as f:
                pickle.dump(tx_df, f)
            return tx_df
        except Exception as e:
            logging.error(f"Attempt {attempt + 1} failed for {contract_address}: {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (2 ** attempt))
            else:
                logging.error(f"Max retries reached for {contract_address}")
                return pd.DataFrame()
    return pd.DataFrame()

def extract_features(tx_df, contract_address, dataset_df=None):
    """Extract features from transaction data."""
    if dataset_df is not None and contract_address in dataset_df['Address'].values:
        row = dataset_df[dataset_df['Address'] == contract_address].iloc[0]
        features = {
            'num_transactions': row.get('total transactions (including tnx to create contract', len(tx_df) if not tx_df.empty else 0),
            'total_value': row.get('total ether received', sum(int(x) for x in tx_df['value']) / 1e18 if not tx_df.empty else 0),
            'avg_gas_price': row.get('avg_gas_price', np.mean([int(x) for x in tx_df['gasPrice']]) if not tx_df.empty else 0),
            'unique_senders': row.get('Unique Received From Addresses', len(tx_df['from'].unique()) if not tx_df.empty else 0),
            'unique_receivers': row.get('Unique Sent To Addresses', len(tx_df['to'].unique()) if not tx_df.empty else 0),
            'contract_interactions': row.get('total ether sent contracts', len(tx_df[tx_df['to'] == contract_address.lower()]) if not tx_df.empty else 0),
            'avg_transaction_interval': row.get('Avg min between sent tnx', np.mean(pd.to_datetime(tx_df['timeStamp'].astype(float), unit='s').diff().dt.total_seconds().dropna()) / 60 if not tx_df.empty else 0),
            'erc20_total_ether_received': row.get(' ERC20 total Ether received', 0),
            'erc20_total_ether_sent': row.get(' ERC20 total ether sent', 0),
            'erc20_unique_tokens': row.get(' ERC20 uniq sent token name', 0) + row.get(' ERC20 uniq rec token name', 0),
            'total_ether_balance': row.get('total ether balance', 0),
            'num_created_contracts': row.get('Number of Created Contracts', 0),
            'time_diff_mins': row.get('Time Diff between first and last (Mins)', 0)
        }
    else:
        features = {
            'num_transactions': len(tx_df) if not tx_df.empty else 0,
            'total_value': sum(int(x) for x in tx_df['value']) / 1e18 if not tx_df.empty else 0,
            'avg_gas_price': np.mean([int(x) for x in tx_df['gasPrice']]) if not tx_df.empty else 0,
            'unique_senders': len(tx_df['from'].unique()) if not tx_df.empty else 0,
            'unique_receivers': len(tx_df['to'].unique()) if not tx_df.empty else 0,
            'contract_interactions': len(tx_df[tx_df['to'] == contract_address.lower()]) if not tx_df.empty else 0,
            'avg_transaction_interval': np.mean(pd.to_datetime(tx_df['timeStamp'].astype(float), unit='s').diff().dt.total_seconds().dropna()) / 60 if not tx_df.empty else 0,
            'erc20_total_ether_received': 0,
            'erc20_total_ether_sent': 0,
            'erc20_unique_tokens': 0,
            'total_ether_balance': 0,
            'num_created_contracts': 0,
            'time_diff_mins': 0
        }
    return features

def prepare_dataset():
    """Prepare dataset with NaN handling."""
    data = []
    labels = []
    skipped_no_features = 0
    dataset_df = pd.read_csv(KAGGLE_DATA_PATH)
    
    # Log dataset composition
    logging.info(f"Dataset FLAG distribution:\n{dataset_df['FLAG'].value_counts()}")
    logging.info(f"Dataset columns: {list(dataset_df.columns)}")
    
    # Fetch scam and legit addresses
    scam_addresses = fetch_scam_addresses(dataset_df)
    legit_addresses = fetch_legit_addresses(dataset_df)
    
    # Process scam contracts
    for address in scam_addresses:
        tx_df = pd.DataFrame()
        features = extract_features(tx_df, address, dataset_df)
        if features:
            data.append(features)
            labels.append(1)
        else:
            skipped_no_features += 1
    
    # Process legitimate contracts
    for address in legit_addresses:
        if address not in scam_addresses:
            tx_df = pd.DataFrame()
            features = extract_features(tx_df, address, dataset_df)
            if features:
                data.append(features)
                labels.append(0)
            else:
                skipped_no_features += 1
    
    X = pd.DataFrame(data)
    y = np.array(labels)
    
    # Impute NaNs with median
    imputer = SimpleImputer(strategy='median')
    X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)
    
    logging.info(f"Skipped {skipped_no_features} addresses due to no features")
    logging.info(f"Dataset: {sum(labels)} scam samples, {len(labels) - sum(labels)} legitimate samples")
    
    return X, y

def train_model(X, y):
    """Train HistGradientBoostingClassifier with class imbalance handling."""
    if len(set(y)) < 2:
        logging.error("Dataset contains only one class. Cannot train a meaningful model.")
        raise ValueError("At least two classes (scam and legitimate) are required for training.")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    logging.info(f"Training set: {len(y_train)} samples, {sum(y_train)} scam, {len(y_train) - sum(y_train)} legitimate")
    
    # Use HistGradientBoostingClassifier (handles NaNs natively)
    model = HistGradientBoostingClassifier(random_state=42)
    param_grid = {
        'max_iter': [100, 200],
        'max_depth': [10, 20, None],
        'min_samples_leaf': [20, 40]
    }
    grid_search = GridSearchCV(model, param_grid, cv=5, scoring='f1_macro', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    logging.info(f"Best parameters: {grid_search.best_params_}")
    model = grid_search.best_estimator_
    
    predictions = model.predict(X_test)
    logging.info("Model Evaluation:")
    logging.info(classification_report(y_test, predictions, labels=[0, 1], zero_division=0))
    logging.info("Confusion Matrix:")
    logging.info(confusion_matrix(y_test, predictions, labels=[0, 1]))
    
    return model, X_test, y_test

# Flask API
app = Flask(__name__)
model = None
feature_columns = None

@app.route('/api/predict_fraud', methods=['POST'])
def predict_fraud():
    """API endpoint for fraud prediction, always fetching from Etherscan."""
    global model, feature_columns
    if not model:
        return jsonify({'error': 'Model not trained'}), 500
    
    data = request.get_json()
    contract_address = data.get('contract_address')
    if not contract_address:
        return jsonify({'error': 'Contract address required'}), 400
    
    try:
        logging.info(f"Fetching Etherscan transactions for {contract_address}")
        tx_df = get_contract_transactions(contract_address)
        features = extract_features(tx_df, contract_address, dataset_df=None)
        if not features:
            return jsonify({'error': 'Could not fetch features'}), 500
        
        input_df = pd.DataFrame([features])[feature_columns]
        # Impute NaNs for prediction
        imputer = SimpleImputer(strategy='median')
        input_df = pd.DataFrame(imputer.fit_transform(input_df), columns=input_df.columns)
        
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0]
        
        result = {
            'contract_address': contract_address,
            'is_fraudulent': bool(prediction),
            'fraud_probability': float(probability[1]),
            'confidence': float(max(probability))
        }
        logging.info(f"Prediction for {contract_address}: {result}")
        return jsonify(result)
    except Exception as e:
        logging.error(f"Error predicting for {contract_address}: {str(e)}")
        return jsonify({'error': str(e)}), 500

def main():
    """Main function to train model and start API."""
    global model, feature_columns
    
    X, y = prepare_dataset()
    feature_columns = X.columns
    
    model, X_test, y_test = train_model(X, y)
    
    import joblib
    joblib.dump(model, 'fraud_detection_model.pkl')
    
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    main()