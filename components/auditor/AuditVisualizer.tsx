"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Zap,
  Search,
  Code,
  TrendingUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface AuditMetrics {
  securityScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  checksPerformed: number;
  issuesFound: number;
  warningsCount: number;
  errorsCount: number;
  successCount: number;
}

interface FindingCategory {
  name: string;
  count: number;
  severity: "low" | "medium" | "high" | "critical";
  color: string;
}

// Enhanced Audit Output Renderer with Visualizations
export const EnhancedAuditRenderer = ({
  title,
  output,
  icon: Icon,
  stageNumber,
}: {
  title: string;
  output: string;
  icon: any;
  stageNumber: 1 | 2;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Parse audit output to extract metrics
  const parseAuditMetrics = (text: string): AuditMetrics => {
    const lines = text.split("\n");
    let errorsCount = 0;
    let warningsCount = 0;
    let successCount = 0;
    let checksPerformed = 0;

    lines.forEach((line) => {
      if (line.includes("ERROR") || line.includes("failed")) errorsCount++;
      if (line.includes("WARNING") || line.includes("suspicious"))
        warningsCount++;
      if (
        line.includes("SUCCESS") ||
        line.includes("completed") ||
        line.includes("passed")
      )
        successCount++;
      if (
        line.includes("Checking") ||
        line.includes("Analyzing") ||
        line.includes("Testing")
      )
        checksPerformed++;
    });

    const totalIssues = errorsCount + warningsCount;
    const securityScore = Math.max(
      0,
      100 - (errorsCount * 20 + warningsCount * 10)
    );

    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    if (errorsCount > 3 || text.includes("CRITICAL")) riskLevel = "CRITICAL";
    else if (errorsCount > 1 || warningsCount > 3) riskLevel = "HIGH";
    else if (warningsCount > 1) riskLevel = "MEDIUM";

    return {
      securityScore,
      riskLevel,
      checksPerformed: Math.max(checksPerformed, 5),
      issuesFound: totalIssues,
      warningsCount,
      errorsCount,
      successCount: Math.max(successCount, 1),
    };
  };

  // Extract finding categories
  const extractFindingCategories = (text: string): FindingCategory[] => {
    const categories: FindingCategory[] = [];

    if (text.includes("transaction") || text.includes("eth_sendTransaction")) {
      categories.push({
        name: "Transaction Analysis",
        count: (text.match(/transaction/gi) || []).length,
        severity: text.includes("failed") ? "high" : "medium",
        color: "#8b5cf6",
      });
    }

    if (text.includes("wallet") || text.includes("balance")) {
      categories.push({
        name: "Wallet Security",
        count: (text.match(/wallet|balance/gi) || []).length,
        severity: text.includes("DECREASED") ? "critical" : "low",
        color: "#06b6d4",
      });
    }

    if (text.includes("contract") || text.includes("smart contract")) {
      categories.push({
        name: "Smart Contracts",
        count: (text.match(/contract/gi) || []).length,
        severity: "medium",
        color: "#10b981",
      });
    }

    if (
      text.includes("frontend") ||
      text.includes("DOM") ||
      text.includes("script")
    ) {
      categories.push({
        name: "Frontend Analysis",
        count: (text.match(/frontend|DOM|script/gi) || []).length,
        severity: "low",
        color: "#f59e0b",
      });
    }

    return categories.length > 0
      ? categories
      : [
          {
            name: "General Security",
            count: 1,
            severity: "low",
            color: "#6b7280",
          },
        ];
  };

  const metrics = parseAuditMetrics(output);
  const findingCategories = extractFindingCategories(output);

  // Chart data
  const checksData = [
    { name: "Passed", value: metrics.successCount, color: "#10b981" },
    { name: "Warnings", value: metrics.warningsCount, color: "#f59e0b" },
    { name: "Errors", value: metrics.errorsCount, color: "#ef4444" },
  ];

  const timelineData = [
    { step: "Initialize", progress: 100, status: "complete" },
    { step: "Scan", progress: 100, status: "complete" },
    {
      step: "Analyze",
      progress: metrics.checksPerformed > 3 ? 100 : 75,
      status: metrics.checksPerformed > 3 ? "complete" : "warning",
    },
    {
      step: "Report",
      progress: output.length > 100 ? 100 : 50,
      status: output.length > 100 ? "complete" : "pending",
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "text-red-600 bg-red-100";
      case "HIGH":
        return "text-red-500 bg-red-50";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "LOW":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatOutput = (text: string) => {
    if (!text)
      return <div className="text-gray-500 italic">No output available</div>;

    const lines = text.split("\n");
    return lines
      .map((line, index) => {
        if (line.trim().startsWith("ERROR:") || line.includes("failed")) {
          return (
            <div
              key={index}
              className="flex items-start space-x-2 py-1 bg-red-50 px-3 rounded"
            >
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 font-medium">{line.trim()}</span>
            </div>
          );
        } else if (
          line.trim().startsWith("WARNING:") ||
          line.includes("suspicious")
        ) {
          return (
            <div
              key={index}
              className="flex items-start space-x-2 py-1 bg-yellow-50 px-3 rounded"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-yellow-700 font-medium">{line.trim()}</span>
            </div>
          );
        } else if (
          line.trim().startsWith("SUCCESS:") ||
          line.includes("completed")
        ) {
          return (
            <div
              key={index}
              className="flex items-start space-x-2 py-1 bg-green-50 px-3 rounded"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-green-700 font-medium">{line.trim()}</span>
            </div>
          );
        } else if (
          line.includes("eth_sendTransaction") ||
          line.includes("transaction")
        ) {
          return (
            <div
              key={index}
              className="flex items-start space-x-2 py-1 bg-purple-50 px-3 rounded"
            >
              <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-purple-700 font-mono text-sm">
                {line.trim()}
              </span>
            </div>
          );
        } else if (line.trim().length > 0) {
          return (
            <div key={index} className="py-0.5 px-3">
              <span className="text-gray-700 text-sm">{line}</span>
            </div>
          );
        }
        return null;
      })
      .filter(Boolean);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="w-full cursor-pointer">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Stage {stageNumber} Analysis Results
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    className={`${getRiskColor(metrics.riskLevel)} border-0`}
                  >
                    {metrics.riskLevel}
                  </Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {metrics.securityScore}%
                    </div>
                    <div className="text-xs text-gray-500">Security Score</div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {metrics.successCount}
                  </div>
                  <div className="text-xs text-gray-500">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-600">
                    {metrics.warningsCount}
                  </div>
                  <div className="text-xs text-gray-500">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600">
                    {metrics.errorsCount}
                  </div>
                  <div className="text-xs text-gray-500">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {metrics.checksPerformed}
                  </div>
                  <div className="text-xs text-gray-500">Checks</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="findings">Findings</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="raw">Raw Output</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Security Score Gauge */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span>Security Score</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <div className="relative w-32 h-32 mx-auto">
                          <svg
                            className="w-32 h-32 transform -rotate-90"
                            viewBox="0 0 36 36"
                          >
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={
                                metrics.securityScore >= 70
                                  ? "#10b981"
                                  : metrics.securityScore >= 40
                                  ? "#f59e0b"
                                  : "#ef4444"
                              }
                              strokeWidth="2"
                              strokeDasharray={`${metrics.securityScore}, 100`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">
                              {metrics.securityScore}%
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={metrics.securityScore}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Check Results Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        <span>Check Results</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={checksData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {checksData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="findings" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Finding Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Search className="w-5 h-5 text-purple-600" />
                        <span>Finding Categories</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={findingCategories}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Risk Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span>Risk Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {findingCategories.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {category.name}
                            </span>
                            <Badge
                              variant="outline"
                              style={{ color: category.color }}
                            >
                              {category.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <Progress
                            value={
                              (category.count /
                                Math.max(
                                  ...findingCategories.map((c) => c.count)
                                )) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span>Analysis Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timelineData.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.status === "complete"
                                ? "bg-green-100 text-green-600"
                                : step.status === "warning"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {step.status === "complete" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : step.status === "warning" ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <div className="w-2 h-2 bg-current rounded-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{step.step}</span>
                              <span className="text-sm text-gray-500">
                                {step.progress}%
                              </span>
                            </div>
                            <Progress value={step.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="raw" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="w-5 h-5 text-gray-600" />
                      <span>Raw Output</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                      {formatOutput(output)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
