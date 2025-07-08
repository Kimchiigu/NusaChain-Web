'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  XCircle,
  Loader2,
  ExternalLink 
} from 'lucide-react';
import { analyzeContractSuspiciousPatterns } from '@/lib/etherscan';
import { ContractAnalysis } from '@/types/security';

export default function ContractAnalyzer() {
  const [contractAddress, setContractAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState('');

  const analyzeContract = async () => {
    if (!contractAddress) {
      setError('Please enter a contract address');
      return;
    }

    if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
      setError('Please enter a valid Ethereum contract address');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      const result = await analyzeContractSuspiciousPatterns(contractAddress);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze contract. Please check the address and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'CRITICAL', color: 'bg-red-500', textColor: 'text-red-600' };
    if (score >= 50) return { level: 'HIGH', color: 'bg-red-400', textColor: 'text-red-600' };
    if (score >= 30) return { level: 'MEDIUM', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { level: 'LOW', color: 'bg-green-500', textColor: 'text-green-600' };
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 50) return 'bg-red-400';
    if (score >= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Contract Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-emerald-600" />
            <span>Smart Contract Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Analyze any Ethereum smart contract for suspicious transaction patterns, 
            potential honeypots, and interactions with flagged addresses.
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
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Analyze
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
      {analysis && (
        <>
          {/* Risk Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Risk Assessment</CardTitle>
                <Badge variant={analysis.riskScore >= 50 ? 'destructive' : 'default'}>
                  {getRiskLevel(analysis.riskScore).level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className={`text-2xl font-bold ${getRiskLevel(analysis.riskScore).textColor}`}>
                    {analysis.riskScore}/100
                  </span>
                </div>
                <Progress 
                  value={analysis.riskScore} 
                  className="h-3"
                  style={{
                    background: `linear-gradient(to right, ${getRiskColor(analysis.riskScore)} ${analysis.riskScore}%, #e5e7eb ${analysis.riskScore}%)`
                  }}
                />
                <div className="text-sm text-gray-600">
                  {analysis.riskScore >= 70 && "⚠️ High risk contract - Exercise extreme caution"}
                  {analysis.riskScore >= 50 && analysis.riskScore < 70 && "⚠️ Moderate risk detected - Proceed with caution"}
                  {analysis.riskScore >= 30 && analysis.riskScore < 50 && "⚠️ Some suspicious patterns found"}
                  {analysis.riskScore < 30 && "✅ Low risk - Contract appears to be legitimate"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Total Transactions</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{analysis.totalTransactions}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-600">Suspicious</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{analysis.suspiciousTransactions}</div>
                  <div className="text-xs text-gray-500">
                    {((analysis.suspiciousTransactions / analysis.totalTransactions) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-600">Failed Txns</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{analysis.failedTransactions}</div>
                  <div className="text-xs text-gray-500">
                    {((analysis.failedTransactions / analysis.totalTransactions) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-600">Unique Addresses</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{analysis.uniqueAddresses}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.failedTransactions > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium text-red-900">High Transaction Failure Rate</div>
                      <div className="text-sm text-red-700">
                        {analysis.failedTransactions} failed transactions detected. This could indicate a honeypot contract.
                      </div>
                    </div>
                  </div>
                )}

                {analysis.newWalletInteractions > analysis.totalTransactions * 0.3 && (
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium text-yellow-900">High New Wallet Activity</div>
                      <div className="text-sm text-yellow-700">
                        Many interactions with newly created wallets detected.
                      </div>
                    </div>
                  </div>
                )}

                {analysis.suspiciousTransactions > analysis.totalTransactions * 0.2 && (
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="font-medium text-orange-900">Suspicious Transaction Patterns</div>
                      <div className="text-sm text-orange-700">
                        Multiple suspicious transaction patterns identified.
                      </div>
                    </div>
                  </div>
                )}

                {analysis.riskScore < 30 && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-900">Contract Appears Legitimate</div>
                      <div className="text-sm text-green-700">
                        No major red flags detected in transaction patterns.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Etherscan
                </Button>
                <Button variant="outline" size="sm">
                  Report Suspicious Activity
                </Button>
                <Button variant="outline" size="sm">
                  Add to Watchlist
                </Button>
                <Button variant="outline" size="sm">
                  Export Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}