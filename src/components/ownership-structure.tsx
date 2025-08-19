"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Users, 
  Building2, 
  Crown, 
  AlertTriangle,
  Loader2,
  Download,
  Info
} from "lucide-react";
import { OwnershipChain } from "@/lib/network-analysis";

interface OwnershipStructureProps {
  companyNumber: string;
  className?: string;
}

export function OwnershipStructureVisualization({ 
  companyNumber, 
  className = "" 
}: OwnershipStructureProps) {
  const [ownershipData, setOwnershipData] = useState<OwnershipChain | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyNumber) {
      fetchOwnershipData();
    }
  }, [companyNumber]);

  const fetchOwnershipData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/network/ownership/${companyNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ownership structure');
      }

      const data: OwnershipChain = await response.json();
      setOwnershipData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'individual': return <Users className="w-4 h-4" />;
      case 'company': return <Building2 className="w-4 h-4" />;
      case 'trust': return <Crown className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case 'individual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'company': return 'bg-green-100 text-green-800 border-green-200';
      case 'trust': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOwnershipWidth = (percentage: number) => {
    return Math.max(20, (percentage / 100) * 200); // Min 20px, max 200px
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Analyzing ownership structure...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchOwnershipData} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!ownershipData) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No ownership data available</p>
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
              <GitBranch className="w-5 h-5" />
              Ownership Structure
            </CardTitle>
            <CardDescription>
              Hierarchical ownership chain and beneficial ownership analysis
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Ownership Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {ownershipData.chainLength}
            </div>
            <div className="text-sm text-blue-600">Chain Length</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {ownershipData.ultimateOwners.length}
            </div>
            <div className="text-sm text-purple-600">Ultimate Owners</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(ownershipData.ownershipConcentration * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-green-600">Concentration</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              {(ownershipData.crossHoldings || ownershipData.circularOwnership) && (
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <div className="text-sm text-orange-600">
              {ownershipData.crossHoldings ? 'Cross Holdings' : 
               ownershipData.circularOwnership ? 'Circular' : 'Clean Structure'}
            </div>
          </div>
        </div>

        {/* Ownership Chain Visualization */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ownership Chain</h3>
          
          {ownershipData.chain.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-muted-foreground">No detailed ownership chain available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ownershipData.chain.map((entity, index) => (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index > 0 && (
                    <div className="absolute left-6 -top-3 w-px h-6 bg-gray-300"></div>
                  )}
                  
                  {/* Entity Node */}
                  <div className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    {/* Level Indicator */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 font-semibold">
                      {entity.level}
                    </div>
                    
                    {/* Entity Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getEntityIcon(entity.entityType)}
                        <h4 className="font-semibold">{entity.entityName}</h4>
                        <Badge className={getEntityColor(entity.entityType)}>
                          {entity.entityType}
                        </Badge>
                        {entity.isBeneficial && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Beneficial Owner
                          </Badge>
                        )}
                      </div>
                      
                      {/* Ownership Percentages */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Ownership:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-2 bg-blue-500 rounded"
                                style={{ width: `${getOwnershipWidth(entity.shareholding)}px` }}
                              ></div>
                              <span className="text-sm font-semibold">{entity.shareholding.toFixed(1)}%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Voting:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-2 bg-purple-500 rounded"
                                style={{ width: `${getOwnershipWidth(entity.votingRights)}px` }}
                              ></div>
                              <span className="text-sm font-semibold">{entity.votingRights.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow to next level */}
                    {index < ownershipData.chain.length - 1 && (
                      <div className="text-gray-400">
                        <GitBranch className="w-5 h-5 rotate-90" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ultimate Beneficial Owners */}
        {ownershipData.ultimateOwners.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ultimate Beneficial Owners</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownershipData.ultimateOwners.map((owner, index) => (
                <Card key={index} className="p-4 border-2 border-dashed border-green-200 bg-green-50">
                  <div className="flex items-center gap-3 mb-3">
                    {getEntityIcon(owner.entityType)}
                    <div className="flex-1">
                      <h4 className="font-semibold">{owner.entityName}</h4>
                      <Badge className={getEntityColor(owner.entityType)}>
                        {owner.entityType}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Control:</span>
                      <span className="font-semibold text-green-700">
                        {owner.totalPercentage.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Control Type:</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {owner.controlType}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Risk Indicators */}
        {(ownershipData.crossHoldings || ownershipData.circularOwnership) && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Risk Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ownershipData.crossHoldings && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Cross-holdings detected in ownership structure</span>
                </div>
              )}
              {ownershipData.circularOwnership && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Circular ownership patterns identified</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm pt-4 border-t">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Individual</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-green-600" />
            <span>Company</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-purple-600" />
            <span>Trust/Fund</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-blue-500 rounded"></div>
            <span>Ownership %</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-purple-500 rounded"></div>
            <span>Voting Rights %</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}