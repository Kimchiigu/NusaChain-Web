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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image
                src="/assets/nusachain-logo-icon.png"
                alt="Loading..."
                width={128}
                height={128}
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
              advanced auditing, real-time threat detection, and intelligent
              transaction analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/auditor">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Security Audit
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              <Link href="https://chromewebstore.google.com/search/nusa%20chain?hl=en-US&utm_source=ext_sidebar">
                <Button variant="outline" size="lg">
                  <Chrome className="w-5 h-5 mr-2" />
                  Try Extension Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user ? (
          // Dashboard for authenticated users
          <div className="space-y-8">
            {/* Welcome Back */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user.email}
              </h2>
              <p className="text-gray-600">
                Your security dashboard is ready. Start with a new audit or
                review your recent activity.
              </p>
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
                    automated testing.
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
                    <Search className="w-5 h-5 text-purple-600" />
                    <span>Contract Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Analyze smart contracts for suspicious patterns and security
                    risks.
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
          <div className="space-y-16">
            {/* Features */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Three-Layer Security Protection
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our comprehensive ecosystem protects Web3 users through
                  multiple layers of security
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
                    simulation.
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
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-600">
                    Comprehensive reporting system with trust scoring and
                    suspicious contract analysis powered by Etherscan
                    integration.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                How It Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Automated Discovery
                    </h4>
                    <p className="text-gray-600">
                      Our system automatically discovers and tests all wallet
                      interactions on target websites using advanced browser
                      automation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Safe Simulation
                    </h4>
                    <p className="text-gray-600">
                      Discovered transactions are safely simulated on forked
                      networks to determine their financial impact without real
                      risk.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Real-time Protection
                    </h4>
                    <p className="text-gray-600">
                      Results feed into our trust database, powering real-time
                      warnings for users before they interact with malicious
                      sites.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Secure Web3?</h2>
              <p className="text-xl mb-6 opacity-90">
                Join the security revolution and protect yourself from Web3
                threats
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
