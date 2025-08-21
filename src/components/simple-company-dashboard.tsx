"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Users, 
  FileText, 
  Shield,
  Search,
  MapPin,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Loader2,
  Download,
  ArrowLeft
} from "lucide-react";
import { CompanySearchResult, CompanyProfile } from "@/lib/companies-house";
import { useRouter } from "next/navigation";

interface SimpleCompanyDashboardProps {
  company: CompanySearchResult;
  onSearch?: (query: string) => void;
  onExportReport?: () => void;
}

interface Officer {
  name: string;
  officer_role: string;
  appointed_on?: string;
  resigned_on?: string;
}

interface CompanyOfficers {
  items: Officer[];
  total_results: number;
}

interface AIRiskAssessment {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  factors: string[];
}

export function SimpleCompanyDashboard({ company, onSearch, onExportReport }: SimpleCompanyDashboardProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [officers, setOfficers] = useState<CompanyOfficers | null>(null);
  const [aiRisk, setAiRisk] = useState<AIRiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCompanyData();
  }, [company.company_number]);

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [profileResponse, officersResponse, aiResponse] = await Promise.allSettled([
        fetch(`/api/companies/${company.company_number}`),
        fetch(`/api/companies/${company.company_number}/officers`),
        fetch(`/api/companies/${company.company_number}/risk-assessment`, { method: 'POST' })
      ]);

      if (profileResponse.status === 'fulfilled' && profileResponse.value.ok) {
        const profileData = await profileResponse.value.json();
        setProfile(profileData);
      }

      if (officersResponse.status === 'fulfilled' && officersResponse.value.ok) {
        const officersData = await officersResponse.value.json();
        setOfficers(officersData);
      }

      if (aiResponse.status === 'fulfilled' && aiResponse.value.ok) {
        const aiData = await aiResponse.value.json();
        setAiRisk(aiData);
      }

    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatAddress = (address: CompanyProfile['registered_office_address']) => {
    if (!address) return 'No address available';
    
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.locality,
      address.postal_code,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span>Loading company details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Dashboard Header with Search */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={() => router.push('/search')} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Button>
        
        {/* Search Bar in Dashboard */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search another company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        <Button onClick={onExportReport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Company Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.title}</h1>
        <p className="text-gray-600 mb-4">Company Number: {company.company_number}</p>
        <Badge className={company.company_status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
          {company.company_status?.toUpperCase()}
        </Badge>
      </div>

      {/* 4-Card Grid Layout (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Overview Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Overview
            </CardTitle>
            <CardDescription>Company registration and business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Registered Address</h4>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  {profile ? formatAddress(profile.registered_office_address) : company.address_snippet || 'Address not available'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Incorporation Date</h4>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {profile?.date_of_creation ? 
                    new Date(profile.date_of_creation).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 
                    company.date_of_creation ? 
                      new Date(company.date_of_creation).toLocaleDateString('en-GB') : 
                      'Not available'
                  }
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Nature of Business (SIC)</h4>
              {profile?.sic_codes && profile.sic_codes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {profile.sic_codes.slice(0, 3).map((code) => (
                    <Badge key={code} variant="outline" className="text-xs">
                      {code}
                    </Badge>
                  ))}
                  {profile.sic_codes.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.sic_codes.length - 3} more
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Not specified</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Directors & PSCs Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Directors & PSCs
            </CardTitle>
            <CardDescription>Key personnel and ownership structure</CardDescription>
          </CardHeader>
          <CardContent>
            {officers && officers.items.length > 0 ? (
              <div className="space-y-3">
                {officers.items.slice(0, 4).map((officer, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-sm">{officer.name}</p>
                      <p className="text-xs text-gray-500">{officer.officer_role}</p>
                    </div>
                    <Badge 
                      variant={officer.resigned_on ? "secondary" : "default"}
                      className={officer.resigned_on ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"}
                    >
                      {officer.resigned_on ? "Resigned" : "Active"}
                    </Badge>
                  </div>
                ))}
                {officers.total_results > 4 && (
                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-500">+{officers.total_results - 4} more officers</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No officer information available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance & Filings Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Compliance & Filings
            </CardTitle>
            <CardDescription>Filing history and compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-4">
                {profile.accounts && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-700">Last Accounts Filed</h4>
                      {profile.accounts.next_due && isOverdue(profile.accounts.next_due) && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-sm">
                      {profile.accounts.last_accounts?.made_up_to ? (
                        <p className="text-gray-600">
                          {new Date(profile.accounts.last_accounts.made_up_to).getFullYear()}
                        </p>
                      ) : (
                        <p className="text-gray-500">Not available</p>
                      )}
                    </div>
                  </div>
                )}

                {profile.accounts?.next_due && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Next Due</h4>
                    <p className={`text-sm ${isOverdue(profile.accounts.next_due) ? "text-red-600 font-medium" : "text-gray-600"}`}>
                      {new Date(profile.accounts.next_due).toLocaleDateString('en-GB')}
                      {isOverdue(profile.accounts.next_due) && (
                        <span className="ml-2">⚠️ Overdue</span>
                      )}
                    </p>
                  </div>
                )}

                {profile.confirmation_statement?.next_due && isOverdue(profile.confirmation_statement.next_due) && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700 font-medium">
                      Confirmation Statement Overdue ⚠️
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Loading compliance information...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Risk Summary Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              AI Risk Summary
            </CardTitle>
            <CardDescription>Intelligent risk assessment and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {aiRisk ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                  <p className="text-3xl font-bold text-gray-900">{aiRisk.riskScore}/10</p>
                  <Badge className={getRiskColor(aiRisk.riskLevel)}>
                    {aiRisk.riskLevel} Risk
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    "{aiRisk.summary}"
                  </p>
                </div>

                {aiRisk.factors.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Key factors:</p>
                    <div className="space-y-1">
                      {aiRisk.factors.slice(0, 2).map((factor, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <TrendingUp className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600">{factor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Generating risk assessment...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}