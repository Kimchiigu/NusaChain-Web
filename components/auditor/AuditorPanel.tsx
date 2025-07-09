"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Play,
  Shield,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  History,
  Calendar,
  Globe,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { saveAuditReport, getAuditReports } from "@/lib/firebase-utils";
import { deleteAuditReport, updateTrustScore } from "@/lib/firebase-utils";
import { AuditReport } from "@/types/security";

interface AuditResult {
  url: string;
  stage1Output: string;
  stage2Output: string;
  status: "success" | "error";
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isMalicious: boolean;
  findings: string[];
}

export default function AuditorPanel() {
  const [user] = useAuthState(auth);
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [auditHistory, setAuditHistory] = useState<AuditReport[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<AuditReport | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAuditHistory();
    }
  }, [user]);

  const loadAuditHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoadingHistory(true);
      const reports = await getAuditReports(user.uid);
      setAuditHistory(reports);
      if (reports.length > 0 && !selectedHistoryItem) {
        setSelectedHistoryItem(reports[0]);
      }
    } catch (error) {
      console.error('Error loading audit history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const runFullAudit = async () => {
    if (!url) {
      setError("Please enter a URL to audit");
      return;
    }

    if (!user) {
      setError("Please sign in to run audits");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUDITOR_API_URL}/full-audit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const auditOutput = await response.text();

      // Parse the audit results
      const stage1Match = auditOutput.match(
        /--- STAGE 1: FULLY AUTOMATED FRONTEND AUDIT ---\n([\s\S]*?)--- STAGE 2: TRANSACTION SIMULATION ---/
      );
      const stage2Match = auditOutput.match(
        /--- STAGE 2: TRANSACTION SIMULATION ---\n([\s\S]*?)--- END OF REPORT ---/
      );

      const stage1Output = stage1Match
        ? stage1Match[1].trim()
        : "No stage 1 output found";
      const stage2Output = stage2Match
        ? stage2Match[1].trim()
        : "No stage 2 output found";

      // Analyze results for threat level
      const isMalicious =
        auditOutput.includes("DECREASED") ||
        auditOutput.includes("drainer") ||
        auditOutput.includes("malicious");
      let threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";

      if (auditOutput.includes("CRITICAL") || auditOutput.includes("drainer")) {
        threatLevel = "CRITICAL";
      } else if (
        auditOutput.includes("HIGH") ||
        auditOutput.includes("DECREASED")
      ) {
        threatLevel = "HIGH";
      } else if (
        auditOutput.includes("MEDIUM") ||
        auditOutput.includes("suspicious")
      ) {
        threatLevel = "MEDIUM";
      }

      const findings = [];
      if (auditOutput.includes("eth_sendTransaction")) {
        findings.push("Transaction request detected");
      }
      if (auditOutput.includes("DECREASED")) {
        findings.push("Wallet balance decrease detected");
      }
      if (auditOutput.includes("failed")) {
        findings.push("Transaction simulation failed");
      }

      const auditResult: AuditResult = {
        url,
        stage1Output,
        stage2Output,
        status: response.ok ? "success" : "error",
        threatLevel,
        isMalicious,
        findings,
      };

      setResult(auditResult);

      // Save to Firebase
      if (response.ok) {
        // Update trust score based on audit results
        const scoreChange = isMalicious ? -15 : 5;
        await updateTrustScore(url, scoreChange);
        
        await saveAuditReport({
          url,
          userId: user.uid,
          stage1Output,
          stage2Output,
          isMalicious,
          threatLevel,
          findings,
          recommendations: isMalicious
            ? ["Avoid interacting with this site", "Report to security team"]
            : ["Site appears safe"],
          contractAddresses: [], // Would extract from audit output
        });
        
        // Reload history to include the new audit
        await loadAuditHistory();
      }
    } catch (err) {
      console.error("Audit failed:", err);
      setError("Audit failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteAudit = async (auditId: string) => {
    if (!user) return;
    
    setDeletingId(auditId);
    try {
      await deleteAuditReport(auditId);
      setAuditHistory(prev => prev.filter(audit => audit.id !== auditId));
      
      // If the deleted item was selected, clear selection
      if (selectedHistoryItem?.id === auditId) {
        const remaining = auditHistory.filter(audit => audit.id !== auditId);
        setSelectedHistoryItem(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (error) {
      console.error('Error deleting audit:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500";
      case "HIGH":
        return "bg-red-400";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="audit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="audit">New Audit</TabsTrigger>
          <TabsTrigger value="history">Audit History</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-6">
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
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isAnalyzing ? "Analyzing..." : "Run Full Audit"}
                </Button>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
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
                    <div
                      className={`w-3 h-3 rounded-full ${getThreatColor(
                        result.threatLevel
                      )}`}
                    />
                    <span>Audit Results</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={result.isMalicious ? "destructive" : "default"}>
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
                    <div
                      className={`text-lg font-bold ${
                        result.isMalicious ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {result.isMalicious ? "Malicious" : "Safe"}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">
                      Threat Level
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.threatLevel}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">
                      Findings
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.findings.length}
                    </div>
                  </div>
                </div>

                {/* Findings */}
                {result.findings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Findings</h4>
                    <div className="space-y-2">
                      {result.findings.map((finding, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stage 1 Results */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Stage 1: Frontend Analysis
                  </h4>
                  <Textarea
                    value={result.stage1Output}
                    readOnly
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>

                {/* Stage 2 Results */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Stage 2: Transaction Simulation
                  </h4>
                  <Textarea
                    value={result.stage2Output}
                    readOnly
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* History List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-blue-600" />
                  <span>Audit History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : auditHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No audits yet</p>
                    <p className="text-sm">Run your first audit to see history here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditHistory.map((audit) => (
                      <div
                        key={audit.id}
                        onClick={() => setSelectedHistoryItem(audit)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedHistoryItem?.id === audit.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">
                              {audit.url}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAudit(audit.id);
                            }}
                            disabled={deletingId === audit.id}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                          >
                            {deletingId === audit.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={audit.isMalicious ? "destructive" : "default"}
                            className="text-xs"
                          >
                            {audit.threatLevel}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(audit.createdAt)}</span>
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
                <CardTitle>Audit Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedHistoryItem ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedHistoryItem.url}</h3>
                        <p className="text-sm text-gray-500">
                          Audited on {formatDate(selectedHistoryItem.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={selectedHistoryItem.isMalicious ? "destructive" : "default"}
                        >
                          {selectedHistoryItem.threatLevel}
                        </Badge>
                        {selectedHistoryItem.isMalicious ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-600">Status</div>
                        <div
                          className={`text-lg font-bold ${
                            selectedHistoryItem.isMalicious ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {selectedHistoryItem.isMalicious ? "Malicious" : "Safe"}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-600">
                          Threat Level
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedHistoryItem.threatLevel}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-600">
                          Findings
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedHistoryItem.findings.length}
                        </div>
                      </div>
                    </div>

                    {/* Findings */}
                    {selectedHistoryItem.findings.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Key Findings</h4>
                        <div className="space-y-2">
                          {selectedHistoryItem.findings.map((finding, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span>{finding}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {selectedHistoryItem.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                        <div className="space-y-2">
                          {selectedHistoryItem.recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stage Outputs */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Stage 1: Frontend Analysis
                        </h4>
                        <Textarea
                          value={selectedHistoryItem.stage1Output}
                          readOnly
                          className="min-h-[150px] font-mono text-sm"
                        />
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Stage 2: Transaction Simulation
                        </h4>
                        <Textarea
                          value={selectedHistoryItem.stage2Output}
                          readOnly
                          className="min-h-[150px] font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select an audit from the history to view details</p>
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