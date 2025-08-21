"use client";

import { useState } from "react";
import { useSession } from "@/lib/use-simple-auth";
import { DashboardLayout } from "@/components/navigation/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle,
  Shield,
  TrendingDown,
  Activity,
  Search,
  FileText,
  Clock,
  Building2,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Minus,
  Eye,
  Download
} from "lucide-react";

export default function RiskAssessmentPage() {
  const { data: session, isPending } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskType, setRiskType] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access Risk Assessment</p>
        </div>
      </div>
    );
  }

  const getRiskLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4" />
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <AlertCircle className="w-4 h-4" />
        };
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Minus className="w-4 h-4" />
        };
    }
  };

  const riskFactors = [
    {
      company: "TechStart Solutions Ltd",
      companyNumber: "12345678",
      overallRisk: "High",
      financialRisk: "High",
      operationalRisk: "Medium",
      complianceRisk: "Low",
      lastUpdated: "2 hours ago",
      keyFactors: ["Late filings", "Declining revenue", "High debt ratio"]
    },
    {
      company: "Green Energy Corp",
      companyNumber: "87654321",
      overallRisk: "Medium",
      financialRisk: "Medium",
      operationalRisk: "Low",
      complianceRisk: "Medium",
      lastUpdated: "1 day ago",
      keyFactors: ["New market entry", "Regulatory changes", "Strong growth"]
    },
    {
      company: "Stable Manufacturing PLC",
      companyNumber: "11223344",
      overallRisk: "Low",
      financialRisk: "Low",
      operationalRisk: "Low",
      complianceRisk: "Low",
      lastUpdated: "3 days ago",
      keyFactors: ["Consistent performance", "Strong governance", "Diversified portfolio"]
    }
  ];

  return (
    <DashboardLayout
      pageTitle="Risk Assessment"
      pageDescription="Comprehensive risk analysis and monitoring for UK companies"
      actions={
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Risk Report
          </Button>
          <Button>
            <AlertTriangle className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Search & Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Company Risk Search
            </CardTitle>
            <CardDescription>Search for companies and analyze their risk profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter company name or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={riskType} onValueChange={setRiskType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Risk Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Types</SelectItem>
                  <SelectItem value="financial">Financial Risk</SelectItem>
                  <SelectItem value="operational">Operational Risk</SelectItem>
                  <SelectItem value="compliance">Compliance Risk</SelectItem>
                  <SelectItem value="market">Market Risk</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">High Risk</p>
                  <p className="text-2xl font-bold text-red-900">23</p>
                  <p className="text-xs text-red-700 mt-1">Companies monitored</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Medium Risk</p>
                  <p className="text-2xl font-bold text-yellow-900">147</p>
                  <p className="text-xs text-yellow-700 mt-1">Companies monitored</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Low Risk</p>
                  <p className="text-2xl font-bold text-green-900">892</p>
                  <p className="text-xs text-green-700 mt-1">Companies monitored</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-blue-900">15</p>
                  <p className="text-xs text-blue-700 mt-1">Require attention</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment Results */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Risk Assessment Results
              </CardTitle>
              <CardDescription>Detailed risk analysis for monitored companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((company) => {
                  const overallRisk = getRiskLevel(company.overallRisk);
                  const financialRisk = getRiskLevel(company.financialRisk);
                  const operationalRisk = getRiskLevel(company.operationalRisk);
                  const complianceRisk = getRiskLevel(company.complianceRisk);

                  return (
                    <div key={company.companyNumber} className="p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-lg">{company.company}</h3>
                            <Badge className={overallRisk.color}>
                              {overallRisk.icon}
                              {company.overallRisk} Risk
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                            <div>
                              <p><strong>Company Number:</strong> {company.companyNumber}</p>
                              <p className="flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                <strong>Updated:</strong> {company.lastUpdated}
                              </p>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span>Financial:</span>
                                <Badge className={`text-xs ${financialRisk.color}`}>
                                  {company.financialRisk}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Operational:</span>
                                <Badge className={`text-xs ${operationalRisk.color}`}>
                                  {company.operationalRisk}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Compliance:</span>
                                <Badge className={`text-xs ${complianceRisk.color}`}>
                                  {company.complianceRisk}
                                </Badge>
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-medium mb-1">Key Risk Factors:</p>
                              <div className="space-y-1">
                                {company.keyFactors.map((factor, index) => (
                                  <div key={index} className="flex items-center gap-1">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    <span className="text-xs">{factor}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Full Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Categories
              </CardTitle>
              <CardDescription>Understanding different types of business risks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <h4 className="font-semibold text-red-900">Financial Risk</h4>
                <p className="text-sm text-red-800 mt-1">
                  Credit risk, liquidity risk, cash flow problems, and financial stability issues.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <h4 className="font-semibold text-orange-900">Operational Risk</h4>
                <p className="text-sm text-orange-800 mt-1">
                  Business operations, supply chain, technology failures, and operational efficiency.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                <h4 className="font-semibold text-yellow-900">Compliance Risk</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  Regulatory compliance, legal issues, and adherence to industry standards.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-semibold text-blue-900">Market Risk</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Market volatility, competitive pressure, and industry-specific challenges.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Risk Alerts
              </CardTitle>
              <CardDescription>Latest risk notifications and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  company: "TechStart Solutions Ltd",
                  alert: "Late filing detected",
                  severity: "High",
                  time: "2 hours ago"
                },
                {
                  company: "Global Trading Inc",
                  alert: "Credit rating downgrade",
                  severity: "Medium",
                  time: "1 day ago"
                },
                {
                  company: "Innovation Labs Ltd",
                  alert: "Director resignation",
                  severity: "Medium",
                  time: "2 days ago"
                },
                {
                  company: "Retail Chain PLC",
                  alert: "Regulatory investigation",
                  severity: "High",
                  time: "3 days ago"
                }
              ].map((alert, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'High' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.company}</p>
                    <p className="text-xs text-muted-foreground">{alert.alert}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{alert.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}