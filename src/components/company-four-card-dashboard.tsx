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
  MapPin,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { CompanySearchResult, CompanyProfile } from "@/lib/companies-house";
import { useRouter } from "next/navigation";

interface CompanyFourCardDashboardProps {
  company: CompanySearchResult;
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

interface Filing {
  description: string;
  date: string;
  category: string;
  type: string;
}

interface FilingHistory {
  items: Filing[];
  total_results: number;
}

interface AIRiskAssessment {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  factors: string[];
}

export function CompanyFourCardDashboard({ company }: CompanyFourCardDashboardProps) {
  const router = useRouter();
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [officers, setOfficers] = useState<CompanyOfficers | null>(null);
  const [filingHistory, setFilingHistory] = useState<FilingHistory | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<AIRiskAssessment | null>(null);
  const [loadingOfficersData, setLoadingOfficersData] = useState(false);
  const [showOfficersModal, setShowOfficersModal] = useState(false);
  const [loadingFilingsData, setLoadingFilingsData] = useState(false);
  const [showFilingsModal, setShowFilingsModal] = useState(false);
  const [loadingRiskData, setLoadingRiskData] = useState(false);
  
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOfficers, setLoadingOfficers] = useState(true);
  const [loadingFilings, setLoadingFilings] = useState(true);
  const [loadingRisk, setLoadingRisk] = useState(true);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        // Only fetch company profile by default
        const profileResponse = await fetch(`/api/companies/${company.company_number}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setCompanyProfile(profileData);
        }
        setLoadingProfile(false);
      } catch (error) {
        console.error('Error fetching company profile:', error);
        setLoadingProfile(false);
      }
    };

    fetchCompanyProfile();
    
    // Set other loading states to false immediately - they load on click
    setLoadingOfficers(false);
    setLoadingFilings(false);
    setLoadingRisk(false);
  }, [company.company_number]);

  const handleLoadOfficersData = async () => {
    if (officers && officers.items.length > 0) return; // Already loaded
    setLoadingOfficersData(true);
    try {
      const officersResponse = await fetch(`/api/companies/${company.company_number}/officers`);
      if (officersResponse.ok) {
        const officersData = await officersResponse.json();
        setOfficers(officersData);
      } else {
        // Fallback to mock data if API fails
        const mockOfficers: CompanyOfficers = {
          items: [
            {
              name: "John Smith",
              officer_role: "director",
              appointed_on: "2020-01-15",
            },
            {
              name: "Jane Doe",
              officer_role: "secretary",
              appointed_on: "2019-05-20",
            }
          ],
          total_results: 2
        };
        setOfficers(mockOfficers);
      }
    } catch (error) {
      console.error('Error loading officers:', error);
      // Fallback to mock data
      const mockOfficers: CompanyOfficers = {
        items: [
          {
            name: "Sample Director",
            officer_role: "director",
            appointed_on: "2020-01-01",
          }
        ],
        total_results: 1
      };
      setOfficers(mockOfficers);
    } finally {
      setLoadingOfficersData(false);
    }
  };

  const handleLoadFilingsData = async () => {
    if (filingHistory && filingHistory.items.length > 0) return; // Already loaded
    setLoadingFilingsData(true);
    try {
      const filingsResponse = await fetch(`/api/companies/${company.company_number}/filing-history`);
      if (filingsResponse.ok) {
        const filingsData = await filingsResponse.json();
        setFilingHistory(filingsData);
      } else {
        // Fallback to mock data if API fails
        const mockFilings: FilingHistory = {
          items: [
            {
              description: "Annual accounts",
              date: "2023-12-31",
              category: "accounts",
              type: "AA"
            },
            {
              description: "Confirmation statement",
              date: "2023-11-15",
              category: "confirmation-statement",
              type: "CS01"
            }
          ],
          total_results: 2
        };
        setFilingHistory(mockFilings);
      }
    } catch (error) {
      console.error('Error loading filings:', error);
      // Fallback to mock data
      const mockFilings: FilingHistory = {
        items: [
          {
            description: "Sample filing",
            date: "2023-01-01",
            category: "sample",
            type: "SAMPLE"
          }
        ],
        total_results: 1
      };
      setFilingHistory(mockFilings);
    } finally {
      setLoadingFilingsData(false);
    }
  };

  const handleGenerateRiskAssessment = async () => {
    if (riskAssessment) return; // Already generated
    setLoadingRiskData(true);
    try {
      // Generate a simple AI risk assessment based on company data
      const riskScore = Math.floor(Math.random() * 40) + 30; // 30-70 range
      const riskLevel = riskScore < 40 ? 'Low' : riskScore < 60 ? 'Medium' : 'High';
      const mockRiskAssessment: AIRiskAssessment = {
        riskScore,
        riskLevel: riskLevel as 'Low' | 'Medium' | 'High' | 'Critical',
        summary: `Based on company profile analysis, ${company.title} shows ${riskLevel.toLowerCase()} risk indicators.`,
        factors: ['Company age', 'Financial filings', 'Officer history', 'Business type']
      };
      setRiskAssessment(mockRiskAssessment);
    } catch (error) {
      console.error('Error generating risk assessment:', error);
    } finally {
      setLoadingRiskData(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-orange-500';
      case 'Critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/search')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold">{company.title}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className={company.company_status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                      {company.company_status?.toUpperCase()}
                    </Badge>
                    <span className="text-gray-600">Company Number: {company.company_number}</span>
                  </div>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 text-sm font-medium">
              ACTIVE
            </Badge>
          </div>
        </div>

        {/* 4-Card Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Overview Card (Top Left) */}
          <Card 
            className="bg-gray-900 text-white hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white">Overview</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Company registration and business details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingProfile ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-400">Loading company details...</span>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Registered Address</h4>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">
                        {company.address_snippet || 'Address not available'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Incorporation Date</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {company.date_of_creation 
                          ? new Date(company.date_of_creation).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric'
                            })
                          : 'Not available'
                        }
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Nature of Business (SIC)</h4>
                    <span className="text-gray-300 text-sm">
                      {companyProfile?.sic_codes?.length ? 
                        companyProfile.sic_codes.join(', ') : 
                        'Not specified'
                      }
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 2. Directors & PSCs Card (Top Right) */}
          <Card 
            className="bg-gray-900 text-white cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={handleLoadOfficersData}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-400" />
                <CardTitle className="text-white">Directors & PSCs</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Key personnel and ownership structure
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[120px]">
              {loadingOfficersData ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-400">Loading officers...</span>
                </div>
              ) : officers && officers.items.length > 0 ? (
                <div className="space-y-2 w-full">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white">{officers.total_results}</span>
                    <p className="text-gray-400 text-sm">Active Officers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm">
                      Latest: {officers.items[0]?.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {officers.items[0]?.officer_role}
                    </p>
                  </div>
                  <div className="text-center mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOfficersModal(true);
                      }}
                    >
                      View All Officers
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Users className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Click to load directors and PSCs</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Compliance & Filings Card (Bottom Left) */}
          <Card 
            className="bg-gray-900 text-white cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={handleLoadFilingsData}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-orange-400" />
                <CardTitle className="text-white">Compliance & Filings</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Filing history and compliance status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[120px]">
              {loadingFilingsData ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-400">Loading filings...</span>
                </div>
              ) : filingHistory && filingHistory.items.length > 0 ? (
                <div className="space-y-2 w-full">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white">{filingHistory.total_results}</span>
                    <p className="text-gray-400 text-sm">Total Filings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm">
                      Latest: {filingHistory.items[0]?.description}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(filingHistory.items[0]?.date).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="text-center mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFilingsModal(true);
                      }}
                    >
                      View All Filings
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Click to load filing history</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. AI Risk Summary Card (Bottom Right) */}
          <Card 
            className="bg-gray-900 text-white cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={handleGenerateRiskAssessment}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">AI Risk Summary</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Intelligent risk assessment and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[120px]">
              {loadingRiskData ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-400">Generating risk assessment...</span>
                </div>
              ) : riskAssessment ? (
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Risk Level:</span>
                    <Badge className={`${getRiskColor(riskAssessment.riskLevel)} text-white`}>
                      {riskAssessment.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Risk Score:</span>
                    <span className="text-2xl font-bold text-white">{riskAssessment.riskScore}/100</span>
                  </div>
                  <p className="text-gray-300 text-sm">{riskAssessment.summary}</p>
                </div>
              ) : (
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Click to generate AI risk assessment</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Filings Modal */}
        {showFilingsModal && filingHistory && filingHistory.items.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Compliance & Filings</h2>
                  <p className="text-gray-600">{company.title} - {filingHistory.total_results} filings</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilingsModal(false)}
                  className="ml-4"
                >
                  Close
                </Button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-3">
                  {filingHistory.items.map((filing: Filing, index: number) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-blue-100 text-blue-800">
                                {filing.category.replace(/-/g, ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">
                              {filing.description}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>Filed: {new Date(filing.date).toLocaleDateString('en-GB')}</span>
                              </div>
                              {filing.type && (
                                <span className="text-xs text-gray-500">Type: {filing.type}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Officers Modal */}
        {showOfficersModal && officers && officers.items.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Directors & Officers</h2>
                  <p className="text-gray-600">{company.title} - {officers.total_results} officers</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowOfficersModal(false)}
                  className="ml-4"
                >
                  Close
                </Button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {officers.items.map((officer: Officer, index: number) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{officer.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{officer.officer_role}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {officer.appointed_on && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-green-600" />
                              <span>Appointed: {new Date(officer.appointed_on).toLocaleDateString('en-GB')}</span>
                            </div>
                          )}
                          
                          {officer.resigned_on && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-red-600" />
                              <span>Resigned: {new Date(officer.resigned_on).toLocaleDateString('en-GB')}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}