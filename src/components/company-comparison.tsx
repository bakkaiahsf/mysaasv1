"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Building2, 
  Calendar, 
  MapPin, 
  Users, 
  BarChart3,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  Plus,
  ArrowLeft
} from "lucide-react";
import { CompanySearchResult, CompanyProfile } from "@/lib/companies-house";

interface CompanyComparisonProps {
  companies: CompanySearchResult[];
  onBack: () => void;
  onRemoveCompany: (companyNumber: string) => void;
}

export function CompanyComparison({ companies, onBack, onRemoveCompany }: CompanyComparisonProps) {
  const [companyProfiles, setCompanyProfiles] = useState<Record<string, CompanyProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const profiles: Record<string, CompanyProfile> = {};
      
      for (const company of companies) {
        try {
          const response = await fetch(`/api/companies/${company.company_number}`);
          if (response.ok) {
            const profile = await response.json();
            profiles[company.company_number] = profile;
          }
        } catch (error) {
          console.error(`Failed to fetch profile for ${company.company_number}:`, error);
        }
      }
      
      setCompanyProfiles(profiles);
      setLoading(false);
    };

    if (companies.length > 0) {
      fetchProfiles();
    }
  }, [companies]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dissolved':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'liquidation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No address available';
    
    const parts = [
      address.address_line_1,
      address.locality,
      address.postal_code
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const getComplianceScore = (company: CompanyProfile) => {
    let score = 100;
    
    if (company.has_been_liquidated) score -= 40;
    if (company.has_insolvency_history) score -= 30;
    if (company.has_charges) score -= 10;
    
    // Check if filings are up to date
    if (company.accounts?.next_due) {
      const nextDue = new Date(company.accounts.next_due);
      const today = new Date();
      if (nextDue < today) score -= 20;
    }
    
    return Math.max(0, score);
  };

  const getIncorporationAge = (dateString: string) => {
    const incorporationDate = new Date(dateString);
    const today = new Date();
    const years = Math.floor((today.getTime() - incorporationDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return years;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading company profiles for comparison...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Company Comparison</h1>
            <p className="text-muted-foreground">
              Compare {companies.length} companies side by side
            </p>
          </div>
        </div>
      </div>

      {/* Company Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => {
          const profile = companyProfiles[company.company_number];
          return (
            <Card key={company.company_number} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => onRemoveCompany(company.company_number)}
              >
                <X className="w-4 h-4" />
              </Button>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg line-clamp-2">{company.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusColor(company.company_status)}>
                    {company.company_status}
                  </Badge>
                  <Badge variant="outline">{company.company_type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  #{company.company_number}
                </p>
              </CardHeader>
            </Card>
          );
        })}
        
        {companies.length < 3 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-6 text-center">
              <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Add another company to compare
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
          <CardDescription>
            Side-by-side analysis of company information and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Metric</th>
                  {companies.map((company) => (
                    <th key={company.company_number} className="text-left p-3 font-medium min-w-[200px]">
                      <div className="truncate">{company.title}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Information */}
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium">Company Status</td>
                  {companies.map((company) => (
                    <td key={company.company_number} className="p-3">
                      <Badge className={getStatusColor(company.company_status)}>
                        {company.company_status}
                      </Badge>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-b">
                  <td className="p-3 font-medium">Company Type</td>
                  {companies.map((company) => (
                    <td key={company.company_number} className="p-3">
                      {company.company_type}
                    </td>
                  ))}
                </tr>
                
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium">Incorporation Date</td>
                  {companies.map((company) => (
                    <td key={company.company_number} className="p-3">
                      {company.date_of_creation ? (
                        <div>
                          <div>{new Date(company.date_of_creation).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {getIncorporationAge(company.date_of_creation)} years old
                          </div>
                        </div>
                      ) : (
                        'Not available'
                      )}
                    </td>
                  ))}
                </tr>
                
                <tr className="border-b">
                  <td className="p-3 font-medium">Registered Address</td>
                  {companies.map((company) => {
                    const profile = companyProfiles[company.company_number];
                    return (
                      <td key={company.company_number} className="p-3">
                        <div className="text-sm">
                          {profile ? formatAddress(profile.registered_office_address) : formatAddress(company.address)}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Risk Indicators */}
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium">Compliance Score</td>
                  {companies.map((company) => {
                    const profile = companyProfiles[company.company_number];
                    if (!profile) return <td key={company.company_number} className="p-3">Loading...</td>;
                    
                    const score = getComplianceScore(profile);
                    return (
                      <td key={company.company_number} className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={`text-lg font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {score}%
                          </div>
                          {score >= 80 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : score >= 60 ? (
                            <Minus className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-medium">Has Been Liquidated</td>
                  {companies.map((company) => {
                    const profile = companyProfiles[company.company_number];
                    if (!profile) return <td key={company.company_number} className="p-3">Loading...</td>;
                    
                    return (
                      <td key={company.company_number} className="p-3">
                        {profile.has_been_liquidated ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium">Has Charges</td>
                  {companies.map((company) => {
                    const profile = companyProfiles[company.company_number];
                    if (!profile) return <td key={company.company_number} className="p-3">Loading...</td>;
                    
                    return (
                      <td key={company.company_number} className="p-3">
                        {profile.has_charges ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-medium">Insolvency History</td>
                  {companies.map((company) => {
                    const profile = companyProfiles[company.company_number];
                    if (!profile) return <td key={company.company_number} className="p-3">Loading...</td>;
                    
                    return (
                      <td key={company.company_number} className="p-3">
                        {profile.has_insolvency_history ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* SIC Codes */}
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium">SIC Codes</td>
                  {companies.map((company) => {
                    const profile = companyProfiles[company.company_number];
                    if (!profile) return <td key={company.company_number} className="p-3">Loading...</td>;
                    
                    return (
                      <td key={company.company_number} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {profile.sic_codes?.slice(0, 3).map((code) => (
                            <Badge key={code} variant="outline" className="text-xs">
                              {code}
                            </Badge>
                          ))}
                          {(profile.sic_codes?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(profile.sic_codes?.length || 0) - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Account Information */}
                <tr className="border-b">
                  <td className="p-3 font-medium">Next Accounts Due</td>
                  {companies.map((company) => {
                    const profile = companyProfiles[company.company_number];
                    if (!profile) return <td key={company.company_number} className="p-3">Loading...</td>;
                    
                    return (
                      <td key={company.company_number} className="p-3">
                        {profile.accounts?.next_due ? (
                          <div className="text-sm">
                            {new Date(profile.accounts.next_due).toLocaleDateString()}
                          </div>
                        ) : (
                          'Not available'
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Highest Compliance Score</h4>
              {(() => {
                let bestCompany = companies[0];
                let bestScore = 0;
                
                companies.forEach(company => {
                  const profile = companyProfiles[company.company_number];
                  if (profile) {
                    const score = getComplianceScore(profile);
                    if (score > bestScore) {
                      bestScore = score;
                      bestCompany = company;
                    }
                  }
                });
                
                return (
                  <div>
                    <p className="font-medium text-green-600">{bestCompany.title}</p>
                    <p className="text-muted-foreground">{bestScore}% compliance score</p>
                  </div>
                );
              })()}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Oldest Company</h4>
              {(() => {
                let oldestCompany = companies[0];
                let oldestDate = new Date();
                
                companies.forEach(company => {
                  if (company.date_of_creation) {
                    const date = new Date(company.date_of_creation);
                    if (date < oldestDate) {
                      oldestDate = date;
                      oldestCompany = company;
                    }
                  }
                });
                
                return (
                  <div>
                    <p className="font-medium text-blue-600">{oldestCompany.title}</p>
                    <p className="text-muted-foreground">
                      {oldestCompany.date_of_creation ? getIncorporationAge(oldestCompany.date_of_creation) : 0} years old
                    </p>
                  </div>
                );
              })()}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Risk Assessment</h4>
              {(() => {
                const activeCount = companies.filter(c => c.company_status.toLowerCase() === 'active').length;
                const riskLevel = activeCount === companies.length ? 'Low' : activeCount > companies.length / 2 ? 'Medium' : 'High';
                const riskColor = riskLevel === 'Low' ? 'text-green-600' : riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600';
                
                return (
                  <div>
                    <p className={`font-medium ${riskColor}`}>{riskLevel} Risk</p>
                    <p className="text-muted-foreground">{activeCount}/{companies.length} companies active</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}