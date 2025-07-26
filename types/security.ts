import { ReactNode } from "react";

export interface AuditReport {
  id: string;
  url: string;
  userId: string;
  stage1Output: string;
  stage2Output: string;
  isMalicious: boolean;
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  findings: string[];
  recommendations: string[];
  contractAddresses: string[];
  createdAt: any;
}

export interface TrustScore {
  id: string;
  url: string;
  score: number; // 0-100, where 0 is completely untrusted, 100 is fully trusted
  reportCount: number;
  createdAt: any;
  lastUpdated: any;
}

export interface SuspiciousTransaction {
  id: string;
  contractAddress: string;
  transactionHash: string;
  suspiciousPattern: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  createdAt: any;
}

export interface ExtensionAlert {
  type: "DANGER" | "WARNING" | "INFO";
  title: string;
  message: string;
  url: string;
  trustScore?: number;
}

export interface ContractAnalysis {
  uniqueAddresses: ReactNode;
  contractAddress: string;
  totalTransactions: number;
  suspiciousTransactions: number;
  newWalletInteractions: number;
  failedTransactions: number;
  flaggedInteractions: number;
  riskScore: number;
  analysisDate: Date;
}

export interface EtherscanTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  isError: string;
  timeStamp: string;
  methodId: string;
}

export interface ContractAnalysisData {
  id: string;
  contractAddress: string;
  isFraudulent: boolean;
  fraudProbability: number;
  confidence: number;
  featuresAnalyzed: Record<string, number>;
  featureImportance: Record<string, number>;
  modelType: string;
  userId?: string;
  createdAt: any;
}
