"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  AlertTriangle,
  TrendingUp,
  Users,
  XCircle,
  Loader2,
  ExternalLink,
  Brain,
  History,
  Calendar,
  Target,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

interface ContractAnalysis {
  contractAddress: string;
  totalTransactions: number;
  suspiciousTransactions: number;
  newWalletInteractions: number;
  failedTransactions: number;
  flaggedInteractions: number;
  riskScore: number;
  analysisDate: Date;
  uniqueAddresses: number;
  isFraudulent: boolean;
  fraudProbability: number;
  confidence: number;
}

interface AnalysisHistory {
  id: string;
  contractAddress: string;
  analysis: ContractAnalysis;
  createdAt: Date;
}

export default function ContractAnalyzer() {
  const [user] = useAuthState(auth);
  const [contractAddress, setContractAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState("");
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<AnalysisHistory | null>(null);

  // Mock history data - in real app, this would come from Firebase
  useEffect(() => {
    if (user) {
      // Mock data for demonstration
      const mockHistory: AnalysisHistory[] = [
        {
          id: "1",
          contractAddress: "0x1234567890123456789012345678901234567890",
          analysis: {
            contractAddress: "0x1234567890123456789012345678901234567890",
            totalTransactions: 1247,
            suspiciousTransactions: 156,
            newWalletInteractions: 834,
            failedTransactions: 156,
            flaggedInteractions: 23,
            riskScore: 87,
            analysisDate: new Date("2024-01-15"),
            uniqueAddresses: 892,
            isFraudulent: true,
            fraudProbability: 87.3,
            confidence: 94.1,
          },
          createdAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          contractAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
          analysis: {
            contractAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            totalTransactions: 45623,
            suspiciousTransactions: 12,
            newWalletInteractions: 2341,
            failedTransactions: 45,
            flaggedInteractions: 0,
            riskScore: 15,
            analysisDate: new Date("2024-01-14"),
            uniqueAddresses: 12456,
            isFraudulent: false,
            fraudProbability: 15.2,
            confidence: 89.7,
          },
          createdAt: new Date("2024-01-14"),
        },
      ];
      setAnalysisHistory(mockHistory);
      if (!selectedHistoryItem && mockHistory.length > 0) {
        setSelectedHistoryItem(mockHistory[0]);
      }
    }
  }, [user]);

  const analyzeContract = async () => {
    if (!contractAddress) {
      setError("Please enter a contract address");
      return;
    }

    if (!contractAddress.startsWith("0x") || contractAddress.length !== 42) {
      setError("Please enter a valid Ethereum contract address");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setAnalysis(null);

    try {
      // Call the AI prediction API
      const response = await fetch("/api/predict_fraud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract_address: contractAddress }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze contract");
      }

      const result = await response.json();

      // Create analysis object with AI results
      const newAnalysis: ContractAnalysis = {
        contractAddress,
        totalTransactions: Math.floor(Math.random() * 5000) + 100, // Mock data
        suspiciousTransactions: Math.floor(Math.random() * 200),
        newWalletInteractions: Math.floor(Math.random() * 1000),
        failedTransactions: Math.floor(Math.random() * 100),
        flaggedInteractions: Math.floor(Math.random() * 50),
        riskScore: Math.round(result.fraud_probability * 100),
        analysisDate: new Date(),
        uniqueAddresses: Math.floor(Math.random() * 2000) + 100,
        isFraudulent: result.is_fraudulent,
        fraudProbability: result.fraud_probability * 100,
        confidence: result.confidence * 100,
      };

      setAnalysis(newAnalysis);

      // Add to history
      const newHistoryItem: AnalysisHistory = {
        id: Date.now().toString(),
        contractAddress,
        analysis: newAnalysis,
        createdAt: new Date(),
      };

      setAnalysisHistory((prev) => [newHistoryItem, ...prev]);
      setSelectedHistoryItem(newHistoryItem);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(
        "Failed to analyze contract. Please check the address and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70)
      return {
        level: "CRITICAL",
        color: "bg-red-500",
        textColor: "text-red-600",
      };
    if (score >= 50)
      return { level: "HIGH", color: "bg-red-400", textColor: "text-red-600" };
    if (score >= 30)
      return {
        level: "MEDIUM",
        color: "bg-yellow-500",
        textColor: "text-yellow-600",
      };
    return { level: "LOW", color: "bg-green-500", textColor: "text-green-600" };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const renderAnalysisDetails = (analysisData: ContractAnalysis) => (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Risk Assessment</span>
            </CardTitle>
            <Badge
              variant={analysisData.isFraudulent ? "destructive" : "default"}
            >
              {getRiskLevel(analysisData.riskScore).level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Fraud Probability</span>
                  <span
                    className={`text-2xl font-bold ${
                      getRiskLevel(analysisData.fraudProbability).textColor
                    }`}
                  >
                    {analysisData.fraudProbability.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={analysisData.fraudProbability}
                  className="h-3"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Model Confidence</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {analysisData.confidence.toFixed(1)}%
                  </span>
                </div>
                <Progress value={analysisData.confidence} className="h-3" />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {analysisData.isFraudulent ? (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    ⚠️ High fraud risk detected - Exercise extreme caution
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <Target className="w-4 h-4" />
                  <span>
                    ✅ Low fraud risk - Contract appears to be legitimate
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">
                  Total Transactions
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analysisData.totalTransactions}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">
                  Suspicious
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analysisData.suspiciousTransactions}
              </div>
              <div className="text-xs text-gray-500">
                {(
                  (analysisData.suspiciousTransactions /
                    analysisData.totalTransactions) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-600">
                  Failed Txns
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analysisData.failedTransactions}
              </div>
              <div className="text-xs text-gray-500">
                {(
                  (analysisData.failedTransactions /
                    analysisData.totalTransactions) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-600">
                  Unique Addresses
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analysisData.uniqueAddresses}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisData.failedTransactions >
              analysisData.totalTransactions * 0.1 && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-medium text-red-900">
                    High Transaction Failure Rate
                  </div>
                  <div className="text-sm text-red-700">
                    {(
                      (analysisData.failedTransactions /
                        analysisData.totalTransactions) *
                      100
                    ).toFixed(1)}
                    % failure rate detected. This could indicate a honeypot
                    contract.
                  </div>
                </div>
              </div>
            )}

            {analysisData.newWalletInteractions >
              analysisData.totalTransactions * 0.3 && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="font-medium text-yellow-900">
                    High New Wallet Activity
                  </div>
                  <div className="text-sm text-yellow-700">
                    Many interactions with newly created wallets detected by AI
                    analysis.
                  </div>
                </div>
              </div>
            )}

            {analysisData.isFraudulent && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-medium text-red-900">
                    AI Fraud Detection Alert
                  </div>
                  <div className="text-sm text-red-700">
                    Random Forest model detected fraudulent patterns with{" "}
                    {analysisData.confidence.toFixed(1)}% confidence.
                  </div>
                </div>
              </div>
            )}

            {!analysisData.isFraudulent &&
              analysisData.fraudProbability < 30 && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-green-900">
                      Contract Appears Legitimate
                    </div>
                    <div className="text-sm text-green-700">
                      AI analysis shows low fraud probability (
                      {analysisData.fraudProbability.toFixed(1)}%) with high
                      confidence.
                    </div>
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyze">New Analysis</TabsTrigger>
          <TabsTrigger value="history">Analysis History</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          {/* Contract Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>AI Smart Contract Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Analyze any Ethereum smart contract using our AI-powered Random
                Forest algorithm to detect fraud patterns and suspicious
                behavior with high accuracy.
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter contract address (0x...)"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="w-full font-mono"
                  />
                </div>
                <Button
                  onClick={analyzeContract}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4 mr-2" />
                  )}
                  Analyze with AI
                </Button>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysis && renderAnalysisDetails(analysis)}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* History List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-purple-600" />
                  <span>Analysis History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No analyses yet</p>
                    <p className="text-sm">
                      Run your first analysis to see history here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysisHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedHistoryItem(item)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedHistoryItem?.id === item.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-mono truncate">
                            {item.contractAddress.slice(0, 10)}...
                            {item.contractAddress.slice(-8)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              item.analysis.isFraudulent
                                ? "destructive"
                                : "default"
                            }
                            className="text-xs"
                          >
                            {item.analysis.fraudProbability.toFixed(1)}% Risk
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* History Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Analysis Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedHistoryItem ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold font-mono">
                          {selectedHistoryItem.contractAddress}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Analyzed on{" "}
                          {formatDate(selectedHistoryItem.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            selectedHistoryItem.analysis.isFraudulent
                              ? "destructive"
                              : "default"
                          }
                        >
                          {selectedHistoryItem.analysis.fraudProbability.toFixed(
                            1
                          )}
                          % Risk
                        </Badge>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Etherscan
                        </Button>
                      </div>
                    </div>

                    {renderAnalysisDetails(selectedHistoryItem.analysis)}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select an analysis from the history to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
