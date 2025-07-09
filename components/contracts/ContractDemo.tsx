'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Search,
  Target,
  Zap,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Users,
  XCircle,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function ContractDemo() {
  return (
    <div className="space-y-8">
      {/* Sign In Prompt */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                Sign in to access AI Contract Analysis
              </h3>
              <p className="text-emerald-700">
                Get AI-powered fraud detection with detailed analysis history and advanced reporting.
              </p>
            </div>
            <Link href="/auth/signin">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-emerald-600" />
            <span>AI-Powered Smart Contract Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Random Forest Algorithm</h4>
              <p className="text-gray-600 text-sm">
                Advanced machine learning model trained on thousands of smart contracts to detect fraudulent patterns with 95%+ accuracy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time Analysis</h4>
              <p className="text-gray-600 text-sm">
                Instant fraud probability scoring by analyzing transaction patterns, gas usage, and behavioral indicators from Etherscan data.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Detailed Reports</h4>
              <p className="text-gray-600 text-sm">
                Comprehensive analysis with risk scores, feature importance, and actionable insights for informed decision-making.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Analysis Process */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Process Visualization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Contract Address Input</h4>
              <p className="text-gray-600 text-sm mb-3">
                Enter any Ethereum smart contract address to begin AI-powered fraud analysis.
              </p>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 text-sm font-mono">0x1234...abcd</span>
                  <Badge variant="outline" className="ml-auto">Analyzing...</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Data Collection & Feature Extraction</h4>
              <p className="text-gray-600 text-sm mb-3">
                Fetching transaction data from Etherscan and extracting 13+ key features for analysis.
              </p>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Transactions:</span>
                    <span className="text-sm font-mono">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unique Addresses:</span>
                    <span className="text-sm font-mono">892</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed Transactions:</span>
                    <span className="text-sm font-mono text-red-600">156 (12.5%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Gas Price:</span>
                    <span className="text-sm font-mono">45.2 Gwei</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Random Forest Prediction</h4>
              <p className="text-gray-600 text-sm mb-3">
                AI model processes extracted features to generate fraud probability and confidence scores.
              </p>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fraud Probability:</span>
                    <span className="text-lg font-bold text-red-600">87.3%</span>
                  </div>
                  <Progress value={87.3} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Model Confidence:</span>
                    <span className="text-sm font-mono">94.1%</span>
                  </div>
                  <Badge variant="destructive" className="mt-2">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    High Fraud Risk
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              4
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Detailed Analysis Report</h4>
              <p className="text-gray-600 text-sm mb-3">
                Comprehensive breakdown of risk factors and feature importance analysis.
              </p>
              <div className="bg-white p-4 rounded border border-gray-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">Failed Transactions</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">156</div>
                    <div className="text-xs text-red-600">High failure rate detected</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">New Wallets</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">67%</div>
                    <div className="text-xs text-yellow-600">Suspicious pattern</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>High transaction failure rate (12.5%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span>Unusual gas price patterns detected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Interactions with newly created wallets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Features</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Our Random Forest model analyzes 13+ key features to determine fraud probability:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Transaction Failure Rate</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-14 h-2 bg-red-500 rounded"></div>
                  </div>
                  <span className="text-xs text-gray-500">High</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Unique Address Ratio</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-12 h-2 bg-emerald-500 rounded"></div>
                  </div>
                  <span className="text-xs text-gray-500">Med</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Gas Price Patterns</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-10 h-2 bg-blue-500 rounded"></div>
                  </div>
                  <span className="text-xs text-gray-500">Med</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Transaction Frequency</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-8 h-2 bg-green-500 rounded"></div>
                  </div>
                  <span className="text-xs text-gray-500">Low</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">ERC20 Token Interactions</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-11 h-2 bg-emerald-500 rounded"></div>
                  </div>
                  <span className="text-xs text-gray-500">Med</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Contract Creation Count</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-6 h-2 bg-gray-400 rounded"></div>
                  </div>
                  <span className="text-xs text-gray-500">Low</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Time Between Transactions</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-9 h-2 bg-indigo-500 rounded"></div>
                  </div>
                  <span className="text-xs text-gray-500">Low</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Ether Balance</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-7 h-2 bg-teal-500 rounded"></div>
                  </div>
                  <span className="text-xs text-gray-500">Low</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Features */}
      <Card>
        <CardHeader>
          <CardTitle>Premium Features (Sign In Required)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Analysis History</span>
              </div>
              <p className="text-gray-600 text-sm ml-7">
                Access all your previous contract analyses with detailed reports and the ability to re-analyze contracts.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Batch Analysis</span>
              </div>
              <p className="text-gray-600 text-sm ml-7">
                Analyze multiple smart contracts simultaneously and compare their fraud probabilities.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Advanced Metrics</span>
              </div>
              <p className="text-gray-600 text-sm ml-7">
                Get detailed feature importance analysis and model confidence intervals for each prediction.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">API Access</span>
              </div>
              <p className="text-gray-600 text-sm ml-7">
                Integrate our AI analysis into your own applications with our RESTful API.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}