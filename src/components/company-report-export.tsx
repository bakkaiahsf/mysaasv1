"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  FileText, 
  Shield,
  Download,
  ArrowLeft,
  MapPin,
  Calendar,
  AlertTriangle,
  Loader2,
  Share,
  Printer
} from "lucide-react";
import { CompanySearchResult, CompanyProfile } from "@/lib/companies-house";

interface CompanyReportExportProps {
  company: CompanySearchResult;
  onBackToDashboard: () => void;
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

export function CompanyReportExport({ company, onBackToDashboard }: CompanyReportExportProps) {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [officers, setOfficers] = useState<CompanyOfficers | null>(null);
  const [aiRisk, setAiRisk] = useState<AIRiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

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
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // TODO: Implement actual PDF generation
      // For now, we'll use browser print functionality
      window.print();
    } catch (error) {
      console.error('PDF download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/report/${company.company_number}`;
      await navigator.clipboard.writeText(shareUrl);
      // TODO: Show toast notification
      console.log('Report link copied to clipboard');
    } catch (error) {
      console.error('Share link error:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span>Generating comprehensive report...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 print:space-y-4">
      {/* Report Header */}
      <div className="flex items-center justify-between print:hidden">
        <Button onClick={() => window.location.href = '/search'} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        
        <div className="flex gap-3">
          <Button onClick={handleShareLink} variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share Link
          </Button>
          <Button onClick={handleDownloadPDF} disabled={downloading} className="bg-blue-600 hover:bg-blue-700">
            {downloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {downloading ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold">KYB Report</h1>
        <p className="text-gray-600">Generated on {new Date().toLocaleDateString('en-GB')}</p>
      </div>

      {/* Company Title */}
      <Card className="print:shadow-none print:border print:border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">
            {company.title} — KYB Report
          </CardTitle>
          <CardDescription className="text-lg">
            Company Number: {company.company_number}
          </CardDescription>
          <div className="flex justify-center mt-2">
            <Badge className={company.company_status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
              {company.company_status?.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Company Overview Section */}
      <Card className="print:shadow-none print:border print:border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Company Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Registered Address</h4>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  {profile ? formatAddress(profile.registered_office_address) : company.address_snippet || 'Address not available'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Incorporation Date</h4>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-gray-700">
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

            <div className="md:col-span-2">
              <h4 className="font-semibold text-gray-800 mb-2">Nature of Business (SIC Codes)</h4>
              {profile?.sic_codes && profile.sic_codes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.sic_codes.map((code) => (
                    <Badge key={code} variant="outline">
                      {code}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Not specified</p>
              )}
            </div>

            {profile?.company_type && (
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-800 mb-2">Company Type</h4>
                <p className="text-gray-700">{profile.company_type.replace(/-/g, ' ').toUpperCase()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Directors & PSCs Section */}
      <Card className="print:shadow-none print:border print:border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-green-600" />
            Directors & PSCs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {officers && officers.items.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                {officers.items.map((officer, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <h4 className="font-medium text-gray-900">{officer.name}</h4>
                      <p className="text-sm text-gray-600">{officer.officer_role}</p>
                      {officer.appointed_on && (
                        <p className="text-xs text-gray-500">
                          Appointed: {new Date(officer.appointed_on).toLocaleDateString('en-GB')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={officer.resigned_on ? "secondary" : "default"}
                        className={officer.resigned_on ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"}
                      >
                        {officer.resigned_on ? "Resigned" : "Active"}
                      </Badge>
                      {officer.resigned_on && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(officer.resigned_on).toLocaleDateString('en-GB')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 text-center pt-2">
                Total Officers: {officers.total_results}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No officer information available</p>
          )}
        </CardContent>
      </Card>

      {/* Compliance & Filings Section */}
      <Card className="print:shadow-none print:border print:border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-600" />
            Compliance & Filings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.accounts && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Accounts Information</h4>
                  <div className="space-y-2">
                    {profile.accounts.last_accounts?.made_up_to && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Accounts Filed:</span>
                        <span className="font-medium">
                          {new Date(profile.accounts.last_accounts.made_up_to).getFullYear()}
                        </span>
                      </div>
                    )}
                    {profile.accounts.next_due && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Next Due:</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${new Date(profile.accounts.next_due) < new Date() ? 'text-red-600' : ''}`}>
                            {new Date(profile.accounts.next_due).toLocaleDateString('en-GB')}
                          </span>
                          {new Date(profile.accounts.next_due) < new Date() && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {profile.confirmation_statement && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Confirmation Statement</h4>
                  <div className="space-y-2">
                    {profile.confirmation_statement.last_made && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Made:</span>
                        <span className="font-medium">
                          {new Date(profile.confirmation_statement.last_made).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    )}
                    {profile.confirmation_statement.next_due && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Next Due:</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${new Date(profile.confirmation_statement.next_due) < new Date() ? 'text-red-600' : ''}`}>
                            {new Date(profile.confirmation_statement.next_due).toLocaleDateString('en-GB')}
                          </span>
                          {new Date(profile.confirmation_statement.next_due) < new Date() && (
                            <span className="text-red-600">⚠️</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="md:col-span-2 border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Additional Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Charges</p>
                    <Badge variant={profile.has_charges ? "outline" : "secondary"} className="mt-1">
                      {profile.has_charges ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Liquidated</p>
                    <Badge variant={profile.has_been_liquidated ? "destructive" : "secondary"} className="mt-1">
                      {profile.has_been_liquidated ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Insolvency History</p>
                    <Badge variant={profile.has_insolvency_history ? "destructive" : "secondary"} className="mt-1">
                      {profile.has_insolvency_history ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Compliance information not available</p>
          )}
        </CardContent>
      </Card>

      {/* AI Risk Narrative Section */}
      <Card className="print:shadow-none print:border print:border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            AI Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aiRisk ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Risk Score</p>
                  <p className="text-3xl font-bold text-gray-900">{aiRisk.riskScore}/10</p>
                </div>
                <Badge className={getRiskColor(aiRisk.riskLevel)}>
                  {aiRisk.riskLevel} Risk
                </Badge>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Risk Summary</h4>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {aiRisk.summary}
                </p>
              </div>

              {aiRisk.factors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Key Risk Factors</h4>
                  <div className="grid gap-2">
                    {aiRisk.factors.map((factor, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{factor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Risk assessment not available</p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="print:hidden">
        <CardContent className="text-center py-6">
          <div className="flex justify-center gap-4 mb-4">
            <Button onClick={handleDownloadPDF} disabled={downloading} className="bg-blue-600 hover:bg-blue-700">
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {downloading ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button onClick={() => window.location.href = '/search'} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search Bar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Footer */}
      <Card className="print:shadow-none print:border print:border-gray-200 print:mt-8">
        <CardContent className="text-center py-6">
          <p className="text-sm text-gray-500 mb-2">
            Report generated on {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB')}
          </p>
          <p className="text-xs text-gray-400">
            Data sourced from Companies House and analyzed using AI-powered risk assessment
          </p>
          <div className="hidden print:block mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              This report is for informational purposes only and should not be considered as financial or legal advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}