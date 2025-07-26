import pickle
import joblib
import numpy as np
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Define feature columns based on your dataset
feature_columns = [
    'num_transactions',
    'total_value',
    'avg_gas_price',
    'unique_senders',
    'unique_receivers',
    'contract_interactions',
    'avg_transaction_interval',
    'erc20_total_ether_received',
    'erc20_total_ether_sent',
    'erc20_unique_tokens',
    'total_ether_balance',
    'num_created_contracts',
    'time_diff_mins'
]

def convert_pkl_to_onnx(pkl_path: str, onnx_path: str):
    try:
        # Load the pickle model
        logging.info(f"Loading model from {pkl_path}")
        model = joblib.load(pkl_path)
        
        # Verify model type
        if not hasattr(model, 'predict_proba'):
            raise ValueError("Loaded model does not support predict_proba. Ensure it's a classifier like HistGradientBoostingClassifier.")
        
        # Define input type for ONNX
        initial_type = [('float_input', FloatTensorType([None, len(feature_columns)]))]
        
        # Convert to ONNX
        logging.info("Converting model to ONNX format")
        onnx_model = convert_sklearn(
            model,
            initial_types=initial_type,
            options={id(model): {'zipmap': False}}  # Avoid zipmap to get raw probabilities
        )
        
        # Save ONNX model
        logging.info(f"Saving ONNX model to {onnx_path}")
        with open(onnx_path, 'wb') as f:
            f.write(onnx_model.SerializeToString())
        
        logging.info("Conversion successful")
        
        # Optional: Verify the ONNX model
        try:
            import onnxruntime as rt
            session = rt.InferenceSession(onnx_path)
            logging.info(f"ONNX model loaded successfully. Output names: {session.get_outputs()[0].name}")
        except Exception as e:
            logging.warning(f"Verification of ONNX model failed: {str(e)}")
        
    except Exception as e:
        logging.error(f"Error during conversion: {str(e)}")
        raise

def main():
    pkl_path = 'fraud_detection_model.pkl'  # Input pickle file
    onnx_path = 'fraud_detection_model.onnx'  # Output ONNX file
    
    convert_pkl_to_onnx(pkl_path, onnx_path)

if __name__ == '__main__':
    main()