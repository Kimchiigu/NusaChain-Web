'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Play, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ExternalLink 
} from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { saveAuditReport } from '@/lib/firebase-utils';

interface AuditResult {
  url: string;
  stage1Output: string;
  stage2Output: string;
  status: 'success' | 'error';
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isMalicious: boolean;
  findings: string[];
}

export default function AuditorPanel() {
  const [user] = useAuthState(auth);
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');

  const runFullAudit = async () => {
    if (!url) {
      setError('Please enter a URL to audit');
      return;
    }

    if (!user) {
      setError('Please sign in to run audits');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUDITOR_API_URL}/full-audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const auditOutput = await response.text();
      
      // Parse the audit results
      const stage1Match = auditOutput.match(/--- STAGE 1: FULLY AUTOMATED FRONTEND AUDIT ---\n([\s\S]*?)--- STAGE 2: TRANSACTION SIMULATION ---/);
      const stage2Match = auditOutput.match(/--- STAGE 2: TRANSACTION SIMULATION ---\n([\s\S]*?)--- END OF REPORT ---/);
      
      const stage1Output = stage1Match ? stage1Match[1].trim() : 'No stage 1 output found';
      const stage2Output = stage2Match ? stage2Match[1].trim() : 'No stage 2 output found';
      
      // Analyze results for threat level
      const isMalicious = auditOutput.includes('DECREASED') || auditOutput.includes('drainer') || auditOutput.includes('malicious');
      let threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      
      if (auditOutput.includes('CRITICAL') || auditOutput.includes('drainer')) {
        threatLevel = 'CRITICAL';
      } else if (auditOutput.includes('HIGH') || auditOutput.includes('DECREASED')) {
        threatLevel = 'HIGH';
      } else if (auditOutput.includes('MEDIUM') || auditOutput.includes('suspicious')) {
        threatLevel = 'MEDIUM';
      }

      const findings = [];
      if (auditOutput.includes('eth_sendTransaction')) {
        findings.push('Transaction request detected');
      }
      if (auditOutput.includes('DECREASED')) {
        findings.push('Wallet balance decrease detected');
      }
      if (auditOutput.includes('failed')) {
        findings.push('Transaction simulation failed');
      }

      const auditResult: AuditResult = {
        url,
        stage1Output,
        stage2Output,
        status: response.ok ? 'success' : 'error',
        threatLevel,
        isMalicious,
        findings
      };

      setResult(auditResult);

      // Save to Firebase
      if (response.ok) {
        await saveAuditReport({
          url,
          userId: user.uid,
          stage1Output,
          stage2Output,
          isMalicious,
          threatLevel,
          findings,
          recommendations: isMalicious ? ['Avoid interacting with this site', 'Report to security team'] : ['Site appears safe'],
          contractAddresses: [] // Would extract from audit output
        });
      }

    } catch (err) {
      console.error('Audit failed:', err);
      setError('Audit failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-red-400';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Audit Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Web3 Security Auditor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={runFullAudit}
              disabled={isAnalyzing || !user}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Run Full Audit'}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {!user && (
            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Please sign in to run security audits</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getThreatColor(result.threatLevel)}`} />
                <span>Audit Results</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={result.isMalicious ? 'destructive' : 'default'}>
                  {result.threatLevel}
                </Badge>
                {result.isMalicious ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Status</div>
                <div className={`text-lg font-bold ${result.isMalicious ? 'text-red-600' : 'text-green-600'}`}>
                  {result.isMalicious ? 'Malicious' : 'Safe'}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Threat Level</div>
                <div className="text-lg font-bold text-gray-900">{result.threatLevel}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Findings</div>
                <div className="text-lg font-bold text-gray-900">{result.findings.length}</div>
              </div>
            </div>

            {/* Findings */}
            {result.findings.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Key Findings</h4>
                <div className="space-y-2">
                  {result.findings.map((finding, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stage 1 Results */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Stage 1: Frontend Analysis</h4>
              <Textarea
                value={result.stage1Output}
                readOnly
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            {/* Stage 2 Results */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Stage 2: Transaction Simulation</h4>
              <Textarea
                value={result.stage2Output}
                readOnly
                className="min-h-[150px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}