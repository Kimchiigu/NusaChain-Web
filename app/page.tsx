"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import Link from "next/link";
import {
  Shield,
  TrendingUp,
  Users,
  AlertTriangle,
  Search,
  Chrome,
  BarChart3,
  ArrowRight,
  Play,
  CheckCircle,
  Brain,
  Zap,
  Target,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-5 h-5 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading NusaChain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user ? (
          // Dashboard for authenticated users
          <div className="space-y-8">
            {/* Hero Section for Logged In Users */}
            <div className="relative overflow-hidden bg-white border-b border-gray-100 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5" />
              <div className="relative p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Image
                      src="/assets/nusachain-logo-icon.png"
                      alt="Loading..."
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      NusaChain
                    </span>{' '}
                    Security Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Your comprehensive Web3 security suite is ready. Start with a new audit or review your recent activity.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Sites Audited"
                value="12"
                icon={<Shield className="w-6 h-6" />}
                trend={{ value: 8, isPositive: true }}
                description="This month"
              />
              <StatsCard
                title="Threats Blocked"
                value="3"
                icon={<AlertTriangle className="w-6 h-6" />}
                trend={{ value: 25, isPositive: false }}
                description="Malicious sites detected"
              />
              <StatsCard
                title="Trust Score Avg"
                value="78"
                icon={<TrendingUp className="w-6 h-6" />}
                description="Out of 100"
              />
              <StatsCard
                title="Contracts Analyzed"
                value="5"
                icon={<Search className="w-6 h-6" />}
                trend={{ value: 15, isPositive: true }}
                description="Smart contracts reviewed"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span>Web3 Auditor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Run comprehensive security audits on Web3 applications with
                    automated testing and transaction simulation.
                  </p>
                  <Link href="/auditor">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                      Start Audit
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-emerald-600" />
                    <span>AI Contract Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Analyze smart contracts using AI-powered Random Forest algorithms to detect fraud patterns and suspicious behavior.
                  </p>
                  <Link href="/contracts">
                    <Button variant="outline" className="w-full">
                      Analyze Contract
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Public landing page content
          <div className="space-y-8">
            {/* Hero Section for Non-Logged In Users */}
            <div className="relative overflow-hidden bg-white border-b border-gray-100 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5" />
              <div className="relative px-8 py-16">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Image
                      src="/assets/nusachain-logo-icon.png"
                      alt="Loading..."
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      NusaChain
                    </span>
                    <br />
                    Security Ecosystem
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Comprehensive Web3 security suite protecting users through
                    advanced auditing, real-time threat detection, and AI-powered
                    smart contract fraud analysis using Random Forest algorithms.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/auth/signup">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                      >
                        Get Started Free
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/extension">
                      <Button variant="outline" size="lg">
                        <Chrome className="w-5 h-5 mr-2" />
                        Try Extension Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Three-Layer Security Protection
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our comprehensive ecosystem protects Web3 users through
                  multiple layers of security and AI-powered analysis
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Web3 Auditor
                  </h3>
                  <p className="text-gray-600">
                    Advanced sandbox environment for comprehensive security
                    analysis using automated frontend discovery and transaction
                    simulation with detailed reporting.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Chrome className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Browser Extension
                  </h3>
                  <p className="text-gray-600">
                    Real-time protection that intercepts transactions and
                    provides human-readable warnings before users interact with
                    malicious sites.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    AI Contract Analysis
                  </h3>
                  <p className="text-gray-600">
                    Machine learning-powered smart contract analysis using Random Forest algorithms to detect fraudulent patterns and suspicious behavior with high accuracy.
                  </p>
                </div>
              </div>
            </div>

            {/* New AI Contract Analysis Feature */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  AI-Powered Smart Contract Fraud Detection
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Our latest feature uses advanced Random Forest machine learning algorithms to analyze smart contracts and detect fraudulent patterns with unprecedented accuracy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">High Accuracy Detection</h4>
                  <p className="text-gray-600 text-sm">
                    Our Random Forest model achieves 95%+ accuracy in detecting fraudulent smart contracts by analyzing transaction patterns, gas usage, and behavioral indicators.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Real-time Analysis</h4>
                  <p className="text-gray-600 text-sm">
                    Simply input any Ethereum contract address and get instant fraud probability scores with detailed explanations of suspicious patterns detected.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Comprehensive Reports</h4>
                  <p className="text-gray-600 text-sm">
                    Get detailed analysis reports including risk scores, transaction patterns, and actionable insights to make informed decisions.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/contracts">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                    <Brain className="w-5 h-5 mr-2" />
                    Try AI Contract Analysis
                  </Button>
                </Link>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                How Our AI Analysis Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Smart Contract Data Collection
                    </h4>
                    <p className="text-gray-600">
                      Our system fetches comprehensive transaction data from Etherscan, including transaction patterns, gas usage, wallet interactions, and temporal behavior.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Feature Engineering & Analysis
                    </h4>
                    <p className="text-gray-600">
                      Advanced feature extraction analyzes 13+ key indicators including transaction frequency, value patterns, unique addresses, failed transactions, and ERC20 token interactions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Random Forest Prediction
                    </h4>
                    <p className="text-gray-600">
                      Our trained Random Forest model processes the features and provides fraud probability scores with confidence levels, helping you make informed decisions about contract safety.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Secure Web3?</h2>
              <p className="text-xl mb-6 opacity-90">
                Join the security revolution and protect yourself from Web3
                threats with AI-powered analysis
              </p>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}