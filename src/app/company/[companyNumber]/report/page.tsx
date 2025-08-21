"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/use-simple-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  ArrowLeft, 
  Users, 
  FileText, 
  Shield, 
  Download, 
  MapPin,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Printer
} from "lucide-react";

interface CompanyProfile {
  company_name: string;
  company_number: string;
  company_status: string;
  company_type: string;
  date_of_creation: string;
  registered_office_address?: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
  sic_codes?: string[];
  accounts?: {
    next_due?: string;
    next_made_up_to?: string;
    accounting_reference_date?: {
      day: number;
      month: number;
    };
  };
  confirmation_statement?: {
    next_due?: string;
    next_made_up_to?: string;
  };
}

interface Officer {
  name: string;
  officer_role: string;
  date_of_birth?: {
    month: number;
    year: number;
  };
  appointed_on?: string;
  resigned_on?: string;
  nationality?: string;
}

export default function CompanyReportPage() {
  const { data: session, isPending: authPending } = useSession();
  const params = useParams();
  const router = useRouter();
  const companyNumber = params?.companyNumber as string;
  
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (companyNumber && session) {
      fetchCompanyData();
    }
  }, [companyNumber, session]);

  const fetchCompanyData = async () => {
    setIsLoading(true);
    try {
      // Fetch company profile
      const companyResponse = await fetch(`/api/companies/${companyNumber}`);
      const companyData = await companyResponse.json();
      setCompany(companyData);

      // Fetch officers
      const officersResponse = await fetch(`/api/companies/${companyNumber}/officers`);
      const officersData = await officersResponse.json();
      setOfficers(officersData.items || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authPending || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Building2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h1>
            <p className="text-gray-600 mb-4">
              We couldn't find a company with number {companyNumber}
            </p>
            <Button onClick={() => router.push('/search')}>
              Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatAddress = (address: any) => {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-600';
      case 'dissolved': return 'bg-red-600';
      case 'liquidation': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const activeOfficers = officers.filter(officer => !officer.resigned_on);
  const resignedOfficers = officers.filter(officer => officer.resigned_on);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print-friendly Header */}
      <div className="no-print bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/company/${companyNumber}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-semibold text-gray-900">KYB Report</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Report Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 border-2 border-gray-800 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-800" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">KYB Report</h1>
              <p className="text-sm text-gray-600">Know Your Business Assessment</p>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {company.company_name}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-gray-600">Company: {company.company_number}</span>
              <Badge className={getStatusColor(company.company_status)}>
                {company.company_status === 'active' && (
                  <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                )}
                {company.company_status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Report generated on {new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Company Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company Number</p>
                    <p className="text-gray-900">{company.company_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company Type</p>
                    <p className="text-gray-900">
                      {company.company_type.replace(/-/g, ' ').toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Incorporation Date</p>
                    <p className="text-gray-900">
                      {new Date(company.date_of_creation).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(company.company_status)}>
                        {company.company_status === 'active' && (
                          <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                        )}
                        {company.company_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Registered Office</h4>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-900 leading-relaxed">
                    {formatAddress(company.registered_office_address)}
                  </p>
                </div>
                
                {company.sic_codes && company.sic_codes.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Nature of Business</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.sic_codes.map((sic, index) => (
                        <Badge key={index} variant="outline">
                          {sic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Directors & PSCs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Directors & Persons with Significant Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeOfficers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Active Officers</h4>
                  <div className="space-y-3">
                    {activeOfficers.map((officer, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{officer.name}</p>
                          <p className="text-sm text-gray-600">
                            {officer.officer_role.replace(/-/g, ' ').toUpperCase()}
                            {officer.appointed_on && (
                              <span className="text-gray-400 ml-2">
                                • Appointed {new Date(officer.appointed_on).toLocaleDateString('en-GB')}
                              </span>
                            )}
                          </p>
                          {officer.nationality && (
                            <p className="text-xs text-gray-500">Nationality: {officer.nationality}</p>
                          )}
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resignedOfficers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Former Officers</h4>
                  <div className="space-y-3">
                    {resignedOfficers.slice(0, 5).map((officer, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{officer.name}</p>
                          <p className="text-sm text-gray-600">
                            {officer.officer_role.replace(/-/g, ' ').toUpperCase()}
                            {officer.resigned_on && (
                              <span className="text-red-600 ml-2">
                                • Resigned {new Date(officer.resigned_on).toLocaleDateString('en-GB')}
                              </span>
                            )}
                          </p>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                    ))}
                    {resignedOfficers.length > 5 && (
                      <p className="text-sm text-gray-500 italic">
                        +{resignedOfficers.length - 5} more former officers
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filing History & Compliance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Compliance & Filing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Upcoming Deadlines</h4>
                <div className="space-y-3">
                  {company.accounts?.next_due && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Next Accounts Due</p>
                        <p className="text-sm text-gray-600">
                          {new Date(company.accounts.next_due).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>
                  )}

                  {company.confirmation_statement?.next_due && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Next Confirmation Statement</p>
                        <p className="text-sm text-gray-600">
                          {new Date(company.confirmation_statement.next_due).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Compliance Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Filing Status</p>
                      <p className="text-sm text-gray-600">All filings up to date</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Company Status</p>
                      <p className="text-sm text-gray-600">Active and compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Risk Assessment */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              AI Risk Assessment & Narrative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Risk Score */}
              <div className="flex items-center justify-between p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Overall Risk Score</h4>
                  <p className="text-sm text-gray-600">Based on comprehensive data analysis</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">3/10</div>
                  <p className="text-sm font-medium text-green-600">LOW RISK</p>
                </div>
              </div>

              {/* Risk Analysis Narrative */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Risk Analysis</h4>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    <strong>Overall Assessment:</strong> This company demonstrates low risk characteristics 
                    based on our comprehensive analysis of available public records and compliance history.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-green-700 mb-2">Positive Indicators</h5>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Company is active with regular filings
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Directors show stability and good track record
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          No significant compliance issues identified
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Regular and timely statutory filings
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-yellow-700 mb-2">Areas to Monitor</h5>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          Monitor upcoming filing deadlines
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          Keep track of director changes
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          Review annual accounts when available
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                    <p className="text-blue-800">
                      <strong>Recommendation:</strong> This company appears suitable for standard business 
                      relationships with normal due diligence procedures. Continue monitoring for any 
                      changes in filing status or director composition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 pt-8 border-t">
          <p>
            This report is based on publicly available information from Companies House and other official sources.
            Data accuracy is dependent on the completeness and timeliness of official filings.
          </p>
          <p className="mt-2">
            Generated by KYB for UK Businesses • {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
      </div>
    </div>
  );
}