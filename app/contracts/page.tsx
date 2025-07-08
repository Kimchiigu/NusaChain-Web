import ContractAnalyzer from '@/components/contracts/ContractAnalyzer';

export default function ContractsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Contract Analysis</h1>
          <p className="text-gray-600">
            Analyze Ethereum smart contracts for suspicious patterns, potential honeypots, and security risks.
          </p>
        </div>
        
        <ContractAnalyzer />
      </div>
    </div>
  );
}