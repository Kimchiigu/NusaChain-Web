'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import ContractAnalyzer from '@/components/contracts/ContractAnalyzer';
import ContractDemo from '@/components/contracts/ContractDemo';

export default function ContractsPage() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Loading contract analyzer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Smart Contract Analysis</h1>
          <p className="text-gray-600">
            Analyze Ethereum smart contracts using AI-powered Random Forest algorithms to detect fraud and suspicious patterns.
          </p>
        </div>
        
        {user ? <ContractAnalyzer /> : <ContractDemo />}
      </div>
    </div>
  );
}