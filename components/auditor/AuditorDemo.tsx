'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Search,
  Globe,
  Zap,
  Target,
  ArrowRight,
  Monitor,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AuditorDemo() {
  return (
    <div className="space-y-8">
      {/* Sign In Prompt */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Sign in to access the full Web3 Auditor
              </h3>
              <p className="text-blue-700">
                Get comprehensive security audits with detailed reports and audit history.
              </p>
            </div>
            <Link href="/auth/signin">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-emerald-600" />
            <span>How Web3 Auditor Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Automated Discovery</h4>
              <p className="text-gray-600 text-sm">
                Our system automatically discovers and tests all wallet interactions on target websites using advanced browser automation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Safe Simulation</h4>
              <p className="text-gray-600 text-sm">
                Discovered transactions are safely simulated on forked networks to determine their financial impact without real risk.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Detailed Analysis</h4>
              <p className="text-gray-600 text-sm">
                Comprehensive reports with threat levels, findings, and recommendations for each audited website.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Audit Process */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Process Visualization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">URL Input & Initial Scan</h4>
              <p className="text-gray-600 text-sm mb-3">
                Enter the target website URL and initiate the automated security scan.
              </p>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 text-sm">https://example-dapp.com</span>
                  <Badge variant="outline" className="ml-auto">Scanning...</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Frontend Analysis</h4>
              <p className="text-gray-600 text-sm mb-3">
                Automated browser discovers wallet connection buttons and transaction triggers.
              </p>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Found wallet connection button</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Detected transaction triggers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Analyzing smart contract interactions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Transaction Simulation</h4>
              <p className="text-gray-600 text-sm mb-3">
                Safe simulation of discovered transactions to analyze potential financial impact.
              </p>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wallet Balance Before:</span>
                    <span className="text-sm font-mono">1.5 ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Simulated Transaction:</span>
                    <span className="text-sm font-mono text-red-600">-1.5 ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wallet Balance After:</span>
                    <span className="text-sm font-mono text-red-600">0.0 ETH</span>
                  </div>
                  <Badge variant="destructive" className="mt-2">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Potential Drainer Detected
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              4
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Security Report</h4>
              <p className="text-gray-600 text-sm mb-3">
                Comprehensive analysis with threat level and actionable recommendations.
              </p>
              <div className="bg-white p-4 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Threat Level:</span>
                  <Badge variant="destructive">CRITICAL</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Wallet balance decrease detected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Suspicious transaction patterns</span>
                  </div>
                  <div className="mt-3 p-2 bg-red-50 rounded">
                    <p className="text-red-800 text-xs">
                      <strong>Recommendation:</strong> Avoid interacting with this site. Potential wallet drainer detected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features for Logged In Users */}
      <Card>
        <CardHeader>
          <CardTitle>Premium Features (Sign In Required)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Audit History & Reports</span>
              </div>
              <p className="text-gray-600 text-sm ml-7">
                Access all your previous audits with detailed reports and the ability to re-analyze sites.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Advanced Analytics</span>
              </div>
              <p className="text-gray-600 text-sm ml-7">
                Get deeper insights with transaction flow analysis and smart contract interaction mapping.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Custom Alerts</span>
              </div>
              <p className="text-gray-600 text-sm ml-7">
                Set up notifications for specific threat patterns and get alerted when similar sites are detected.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Export Reports</span>
              </div>
              <p className="text-gray-600 text-sm ml-7">
                Download detailed PDF reports for compliance, sharing with team members, or personal records.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
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