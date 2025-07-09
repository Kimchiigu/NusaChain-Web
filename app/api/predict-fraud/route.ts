import { NextRequest, NextResponse } from 'next/server';
import { saveContractAnalysis, getContractAnalysis } from '@/lib/firebase-utils';

interface PredictionRequest {
  contract_address: string;
  user_id?: string;
}

interface PredictionResponse {
  contract_address: string;
  is_fraudulent: boolean;
  fraud_probability: number;
  confidence: number;
  features_analyzed?: Record<string, number>;
  model_type?: string;
  feature_importance?: Record<string, number>;
}

// Mock feature extraction for demonstration
function extractMockFeatures(contractAddress: string) {
  // In production, this would call Etherscan API and extract real features
  const seed = contractAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280;
  
  return {
    num_transactions: Math.floor(random(seed) * 5000) + 100,
    total_value: random(seed + 1) * 1000,
    avg_gas_price: random(seed + 2) * 100 + 20,
    unique_senders: Math.floor(random(seed + 3) * 1000) + 50,
    unique_receivers: Math.floor(random(seed + 4) * 800) + 30,
    contract_interactions: Math.floor(random(seed + 5) * 200),
    avg_transaction_interval: random(seed + 6) * 1440, // minutes
    erc20_total_ether_received: random(seed + 7) * 500,
    erc20_total_ether_sent: random(seed + 8) * 400,
    erc20_unique_tokens: Math.floor(random(seed + 9) * 20),
    total_ether_balance: random(seed + 10) * 100,
    num_created_contracts: Math.floor(random(seed + 11) * 5),
    time_diff_mins: random(seed + 12) * 10080 // week in minutes
  };
}

// Mock Random Forest prediction
function predictFraud(features: Record<string, number>) {
  // Simple heuristic-based prediction for demonstration
  let riskScore = 0;
  
  // High transaction failure rate increases risk
  if (features.num_transactions > 0) {
    const failureRate = Math.random() * 0.3; // Mock failure rate
    riskScore += failureRate * 40;
  }
  
  // Low unique addresses to transaction ratio increases risk
  const uniqueRatio = (features.unique_senders + features.unique_receivers) / features.num_transactions;
  if (uniqueRatio < 0.5) {
    riskScore += 30;
  }
  
  // High gas price volatility increases risk
  if (features.avg_gas_price > 80) {
    riskScore += 20;
  }
  
  // ERC20 token interactions pattern
  if (features.erc20_unique_tokens > 10) {
    riskScore += 15;
  }
  
  // Add some randomness for demonstration
  riskScore += (Math.random() - 0.5) * 20;
  
  const fraudProbability = Math.max(0, Math.min(1, riskScore / 100));
  const confidence = 0.85 + Math.random() * 0.1; // 85-95% confidence
  
  return {
    is_fraudulent: fraudProbability > 0.5,
    fraud_probability: fraudProbability,
    confidence: confidence
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();
    const { contract_address, user_id } = body;

    if (!contract_address) {
      return NextResponse.json(
        { error: 'Contract address is required' },
        { status: 400 }
      );
    }

    // Validate Ethereum address format
    if (!contract_address.startsWith('0x') || contract_address.length !== 42) {
      return NextResponse.json(
        { error: 'Invalid Ethereum contract address format' },
        { status: 400 }
      );
    }

    // Check if we have a cached analysis
    const existingAnalysis = await getContractAnalysis(contract_address);
    if (existingAnalysis && existingAnalysis.createdAt) {
      const hoursSinceAnalysis = (Date.now() - existingAnalysis.createdAt.toDate().getTime()) / (1000 * 60 * 60);
      
      // Return cached result if less than 24 hours old
      if (hoursSinceAnalysis < 24) {
        return NextResponse.json({
          contract_address,
          is_fraudulent: existingAnalysis.isFraudulent,
          fraud_probability: existingAnalysis.fraudProbability / 100,
          confidence: existingAnalysis.confidence / 100,
          features_analyzed: existingAnalysis.featuresAnalyzed,
          model_type: 'Random Forest (Cached)',
          feature_importance: existingAnalysis.featureImportance
        });
      }
    }

    // Extract features (in production, this would call Etherscan API)
    const features = extractMockFeatures(contract_address);
    
    // Make prediction using mock Random Forest model
    const prediction = predictFraud(features);
    
    // Mock feature importance
    const featureImportance = {
      num_transactions: 0.15,
      unique_senders: 0.12,
      avg_gas_price: 0.10,
      contract_interactions: 0.09,
      erc20_unique_tokens: 0.08,
      total_value: 0.07,
      unique_receivers: 0.06,
      avg_transaction_interval: 0.05,
      erc20_total_ether_received: 0.04,
      erc20_total_ether_sent: 0.04,
      total_ether_balance: 0.03,
      num_created_contracts: 0.02,
      time_diff_mins: 0.01
    };

    // Save analysis to Firebase
    const analysisData = {
      contractAddress: contract_address,
      isFraudulent: prediction.is_fraudulent,
      fraudProbability: prediction.fraud_probability * 100,
      confidence: prediction.confidence * 100,
      featuresAnalyzed: features,
      featureImportance,
      modelType: 'Random Forest',
      userId: user_id || null
    };

    await saveContractAnalysis(analysisData);

    const response: PredictionResponse = {
      contract_address,
      is_fraudulent: prediction.is_fraudulent,
      fraud_probability: prediction.fraud_probability,
      confidence: prediction.confidence,
      features_analyzed: features,
      model_type: 'Random Forest',
      feature_importance: featureImportance
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in fraud prediction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Fraud prediction API is running', model_type: 'Random Forest' },
    { status: 200 }
  );
}