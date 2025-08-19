"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Info,
  Download,
  Filter,
  Loader2
} from "lucide-react";
import { RiskNetwork } from "@/lib/network-analysis";

interface RiskHeatmapProps {
  entityType: string;
  entityId: string;
  className?: string;
}

interface RiskMatrixCell {
  category: string;
  subcategory: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  description: string;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
}

export function RiskHeatmapVisualization({ 
  entityType, 
  entityId, 
  className = "" 
}: RiskHeatmapProps) {
  const [riskData, setRiskData] = useState<RiskNetwork | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskMatrixCell | null>(null);

  // Risk matrix categories and subcategories
  const riskMatrix: RiskMatrixCell[] = [
    // Financial Risk
    {
      category: "Financial",
      subcategory: "Liquidity",
      riskLevel: "medium",
      score: 65,
      description: "Cash flow and liquidity position",
      trend: "stable",
      factors: ["Recent filing delays", "Payment history"]
    },
    {
      category: "Financial",
      subcategory: "Solvency",
      riskLevel: "low",
      score: 25,
      description: "Debt to equity ratio and financial stability",
      trend: "down",
      factors: ["Improving balance sheet", "Reduced debt"]
    },
    {
      category: "Financial",
      subcategory: "Profitability",
      riskLevel: "medium",
      score: 55,
      description: "Revenue trends and profit margins",
      trend: "up",
      factors: ["Declining margins", "Market competition"]
    },
    
    // Operational Risk
    {
      category: "Operational",
      subcategory: "Management",
      riskLevel: "high",
      score: 85,
      description: "Leadership stability and governance",
      trend: "up",
      factors: ["Recent director changes", "High turnover"]
    },
    {
      category: "Operational",
      subcategory: "Compliance",
      riskLevel: "low",
      score: 20,
      description: "Regulatory compliance and filing status",
      trend: "stable",
      factors: ["Up to date filings", "No penalties"]
    },
    {
      category: "Operational",
      subcategory: "Industry",
      riskLevel: "medium",
      score: 60,
      description: "Sector-specific risks and market conditions",
      trend: "up",
      factors: ["Market volatility", "Regulatory changes"]
    },
    
    // Relationship Risk
    {
      category: "Relationship",
      subcategory: "Director Network",
      riskLevel: "medium",
      score: 70,
      description: "Director connections and cross-appointments",
      trend: "stable",
      factors: ["Multiple directorships", "Shared addresses"]
    },
    {
      category: "Relationship",
      subcategory: "Ownership",
      riskLevel: "low",
      score: 30,
      description: "Ownership structure complexity",
      trend: "down",
      factors: ["Clear ownership", "Stable structure"]
    },
    {
      category: "Relationship",
      subcategory: "Geographic",
      riskLevel: "medium",
      score: 45,
      description: "Address clustering and geographic risks",
      trend: "stable",
      factors: ["Shared business addresses", "Multiple registrations"]
    }
  ];

  useEffect(() => {
    if (entityType && entityId) {
      fetchRiskData();
    }
  }, [entityType, entityId]);

  const fetchRiskData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/network/risk?entityType=${entityType}&entityId=${entityId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch risk analysis');
      }

      const data: RiskNetwork = await response.json();
      setRiskData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string, intensity: 'bg' | 'text' | 'border' = 'bg') => {
    const colors = {
      low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    };
    
    return colors[riskLevel as keyof typeof colors]?.[intensity] || colors.low[intensity];
  };

  const getRiskOpacity = (score: number) => {
    return Math.max(0.3, score / 100);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-green-500" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
    }
  };

  const categories = ['Financial', 'Operational', 'Relationship'];
  const subcategories = {
    Financial: ['Liquidity', 'Solvency', 'Profitability'],
    Operational: ['Management', 'Compliance', 'Industry'],
    Relationship: ['Director Network', 'Ownership', 'Geographic']
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Analyzing risk profile...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchRiskData} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Risk Assessment Matrix
            </CardTitle>
            <CardDescription>
              Comprehensive risk analysis across multiple dimensions
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {riskData?.overallRiskScore || 62}
            </div>
            <div className="text-sm text-red-600 font-medium">Overall Risk Score</div>
            <Badge 
              className={getRiskColor(riskData?.riskCategory || 'medium', 'bg')}
              variant="outline"
            >
              {riskData?.riskCategory || 'Medium'} Risk
            </Badge>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {riskMatrix.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">High Risk Areas</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {riskMatrix.filter(r => r.trend === 'up').length}
            </div>
            <div className="text-sm text-gray-600">Increasing Risks</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {riskMatrix.filter(r => r.trend === 'down').length}
            </div>
            <div className="text-sm text-gray-600">Improving Areas</div>
          </div>
        </div>

        {/* Risk Heatmap Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Risk Heatmap</h3>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header Row */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="font-semibold text-sm text-gray-600 p-2">Risk Category</div>
                {categories.map(category => (
                  <div key={category} className="font-semibold text-sm text-center p-2 bg-gray-100 rounded">
                    {category}
                  </div>
                ))}
              </div>
              
              {/* Risk Matrix Rows */}
              {Math.max(...Object.values(subcategories).map(arr => arr.length)) > 0 && 
                Array.from({ length: 3 }, (_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-4 gap-2 mb-2">
                    <div className="p-2 text-sm font-medium text-gray-600">
                      {rowIndex === 0 ? 'Primary' : rowIndex === 1 ? 'Secondary' : 'Tertiary'}
                    </div>
                    
                    {categories.map(category => {
                      const subcategory = subcategories[category as keyof typeof subcategories][rowIndex];
                      const riskItem = riskMatrix.find(r => r.category === category && r.subcategory === subcategory);
                      
                      if (!riskItem) {
                        return <div key={`${category}-${rowIndex}`} className="p-2"></div>;
                      }
                      
                      return (
                        <div
                          key={`${category}-${subcategory}`}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                            getRiskColor(riskItem.riskLevel, 'bg')
                          } ${getRiskColor(riskItem.riskLevel, 'border')} ${
                            selectedRisk?.subcategory === riskItem.subcategory ? 'ring-2 ring-blue-500' : ''
                          }`}
                          style={{ opacity: getRiskOpacity(riskItem.score) }}
                          onClick={() => setSelectedRisk(riskItem)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{riskItem.subcategory}</span>
                            {getTrendIcon(riskItem.trend)}
                          </div>
                          <div className={`text-lg font-bold ${getRiskColor(riskItem.riskLevel, 'text')}`}>
                            {riskItem.score}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {riskItem.riskLevel}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Risk Details Panel */}
        {selectedRisk && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {selectedRisk.category} - {selectedRisk.subcategory}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className={getRiskColor(selectedRisk.riskLevel, 'bg')}>
                  {selectedRisk.riskLevel} Risk
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Score:</span>
                  <span className="text-lg font-bold">{selectedRisk.score}/100</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Trend:</span>
                  {getTrendIcon(selectedRisk.trend)}
                </div>
              </div>
              
              <p className="text-sm text-gray-700">{selectedRisk.description}</p>
              
              <div>
                <h4 className="font-medium mb-2">Risk Factors:</h4>
                <ul className="space-y-1">
                  {selectedRisk.factors.map((factor, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Connections */}
        {riskData && riskData.riskConnections.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Risk Connections</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskData.riskConnections.slice(0, 4).map((connection, index) => (
                <Card key={index} className={`border ${getRiskColor(connection.riskLevel, 'border')}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{connection.entityName}</h4>
                      <Badge className={getRiskColor(connection.riskLevel, 'bg')}>
                        {connection.riskLevel}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>Type: {connection.connectionType}</div>
                      <div>Relationship: {connection.relationshipType}</div>
                      <div>Risk Score: {connection.riskScore}/100</div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-xs font-medium mb-1">Risk Factors:</div>
                      <div className="flex flex-wrap gap-1">
                        {connection.riskFactors.slice(0, 2).map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        {riskData && riskData.recommendedActions.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {riskData.recommendedActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span>Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 rounded"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-200 rounded"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span>Critical Risk</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-red-500" />
              <span>Increasing</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-green-500" />
              <span>Decreasing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Stable</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}