import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
// import * as ort from "onnxruntime-node";
import {
  saveContractAnalysis,
  getContractAnalysis,
} from "@/lib/firebase-utils";

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

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// Feature columns in the exact order used during model training
const FEATURE_COLUMNS = [
  "num_transactions",
  "total_value",
  "avg_gas_price",
  "unique_senders",
  "unique_receivers",
  "contract_interactions",
  "avg_transaction_interval",
  "erc20_total_ether_received",
  "erc20_total_ether_sent",
  "erc20_unique_tokens",
  "total_ether_balance",
  "num_created_contracts",
  "time_diff_mins",
];

async function fetchTransactions(contractAddress: string) {
  try {
    const response = await axios.get("https://api.etherscan.io/api", {
      params: {
        module: "account",
        action: "txlist",
        address: contractAddress,
        startblock: 0,
        endblock: 99999999,
        sort: "asc",
        apikey: ETHERSCAN_API_KEY,
      },
    });

    if (response.data.status === "1") {
      return response.data.result;
    } else {
      throw new Error("Etherscan API error: " + response.data.message);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

// async function predictFraud(features: Record<string, number>) {
//   try {
//     const session = await ort.InferenceSession.create(
//       "public/model/fraud_detection_model.onnx"
//     );
//     // Ensure features are in the correct order and all are numbers
//     const inputArray = FEATURE_COLUMNS.map((key) =>
//       typeof features[key] === "number" ? features[key] : 0
//     );
//     const input = new ort.Tensor("float32", inputArray, [
//       1,
//       FEATURE_COLUMNS.length,
//     ]);
//     const outputs = await session.run({ float_input: input });
//     const probability = outputs.probabilities.data; // Adjust based on your model's output name
//     const prediction = Number(probability[1]) > 0.5 ? 1 : 0;
//     return {
//       is_fraudulent: !!prediction,
//       fraud_probability: Number(probability[1]),
//       confidence: Math.max(Number(probability[0]), Number(probability[1])),
//     };
//   } catch (error) {
//     console.error("Error in predictFraud:", error);
//     throw new Error("Failed to make prediction");
//   }
// }

function extractFeatures(transactions: any[], contractAddress: string) {
  const txCount = transactions.length;
  const totalValue = transactions.reduce(
    (sum, tx) => sum + Number(tx.value) / 1e18,
    0
  );
  const gasPrices = transactions
    .map((tx) => Number(tx.gasPrice))
    .filter((price) => price > 0);
  const avgGasPrice = gasPrices.length
    ? gasPrices.reduce((sum, price) => sum + price, 0) / gasPrices.length
    : 0;
  const uniqueSenders = new Set(transactions.map((tx) => tx.from)).size;
  const uniqueReceivers = new Set(transactions.map((tx) => tx.to)).size;
  const contractInteractions = transactions.filter(
    (tx) => tx.to.toLowerCase() === contractAddress.toLowerCase()
  ).length;

  // Calculate average transaction interval (in minutes)
  let avgTransactionInterval = 0;
  if (transactions.length > 1) {
    const timestamps = transactions
      .map((tx) => Number(tx.timeStamp))
      .sort((a, b) => a - b);
    const intervals = timestamps
      .slice(1)
      .map((t, i) => (t - timestamps[i]) / 60);
    avgTransactionInterval = intervals.length
      ? intervals.reduce((sum, interval) => sum + interval, 0) /
        intervals.length
      : 0;
  }

  return {
    num_transactions: txCount,
    total_value: totalValue,
    avg_gas_price: avgGasPrice,
    unique_senders: uniqueSenders,
    unique_receivers: uniqueReceivers,
    contract_interactions: contractInteractions,
    avg_transaction_interval: avgTransactionInterval,
    erc20_total_ether_received: 0, // Add ERC20 logic if needed
    erc20_total_ether_sent: 0,
    erc20_unique_tokens: 0,
    total_ether_balance: 0,
    num_created_contracts: 0,
    time_diff_mins: 0,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();
    const { contract_address, user_id } = body;

    if (!contract_address) {
      return NextResponse.json(
        { error: "Contract address is required" },
        { status: 400 }
      );
    }

    if (!contract_address.startsWith("0x") || contract_address.length !== 42) {
      return NextResponse.json(
        { error: "Invalid Ethereum contract address format" },
        { status: 400 }
      );
    }

    const existingAnalysis = await getContractAnalysis(contract_address);
    if (existingAnalysis && existingAnalysis.createdAt) {
      const hoursSinceAnalysis =
        (Date.now() - existingAnalysis.createdAt.toDate().getTime()) /
        (1000 * 60 * 60);
      if (hoursSinceAnalysis < 24) {
        return NextResponse.json({
          contract_address,
          is_fraudulent: existingAnalysis.isFraudulent,
          fraud_probability: existingAnalysis.fraudProbability / 100,
          confidence: existingAnalysis.confidence / 100,
          features_analyzed: existingAnalysis.featuresAnalyzed,
          model_type: "HistGradientBoostingClassifier (Cached)",
          feature_importance: existingAnalysis.featureImportance,
        });
      }
    }

    const transactions = await fetchTransactions(contract_address);
    const features = extractFeatures(transactions, contract_address);
    // const prediction = await predictFraud(features);

    const featureImportance = {
      num_transactions: 0.15,
      unique_senders: 0.12,
      avg_gas_price: 0.1,
      contract_interactions: 0.09,
      erc20_unique_tokens: 0.08,
      total_value: 0.07,
      intervening_receivers: 0.06,
      avg_transaction_interval: 0.05,
      erc20_total_ether_received: 0.04,
      erc20_total_ether_sent: 0.04,
      total_ether_balance: 0.03,
      num_created_contracts: 0.02,
      time_diff_mins: 0.01,
    };

    // const analysisData = {
    //   contractAddress: contract_address,
    //   isFraudulent: prediction.is_fraudulent ?? false,
    //   fraudProbability: prediction.fraud_probability * 100,
    //   confidence: prediction.confidence * 100,
    //   featuresAnalyzed: features,
    //   featureImportance,
    //   modelType: "HistGradientBoostingClassifier",
    //   userId: user_id || null,
    //   createdAt: new Date(),
    // };

    // @ts-ignore
    await saveContractAnalysis(analysisData);

    // const response: PredictionResponse = {
    //   contract_address,
    //   is_fraudulent: prediction.is_fraudulent,
    //   fraud_probability: prediction.fraud_probability,
    //   confidence: prediction.confidence,
    //   features_analyzed: features,
    //   model_type: "HistGradientBoostingClassifier",
    //   feature_importance: featureImportance,
    // };

    // return NextResponse.json(response);
  } catch (error) {
    console.error("Error in fraud prediction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Fraud prediction API is running",
      model_type: "HistGradientBoostingClassifier",
    },
    { status: 200 }
  );
}
