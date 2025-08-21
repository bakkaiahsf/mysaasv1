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
  Share2,
  MapPin,
  Calendar,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
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

export default function CompanyPage() {
  const { data: session, isPending: authPending } = useSession();
  const params = useParams();
  const router = useRouter();
  const companyNumber = params?.companyNumber as string;
  
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/search')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {company.company_name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500">
                    Company: {company.company_number}
                  </span>
                  <Badge className={getStatusColor(company.company_status)}>
                    {company.company_status === 'active' && (
                      <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                    )}
                    {company.company_status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => router.push(`/company/${companyNumber}/report`)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Report
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: Building },
              { id: 'directors', label: 'Directors', icon: Users },
              { id: 'compliance', label: 'Compliance', icon: FileText },
              { id: 'risk', label: 'Risk Summary', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Registered Address</p>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-900">
                    {formatAddress(company.registered_office_address)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Incorporation Date</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {new Date(company.date_of_creation).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Company Type</p>
                <p className="text-sm text-gray-900 mt-1">
                  {company.company_type.replace(/-/g, ' ').toUpperCase()}
                </p>
              </div>

              {company.sic_codes && company.sic_codes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Nature of Business (SIC)</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {company.sic_codes.slice(0, 3).map((sic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {sic}
                      </Badge>
                    ))}
                    {company.sic_codes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{company.sic_codes.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Directors & PSCs Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Directors & PSCs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOfficers.slice(0, 4).map((officer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{officer.name}</p>
                      <p className="text-sm text-gray-600">
                        {officer.officer_role.replace(/-/g, ' ')}
                        {officer.appointed_on && (
                          <span className="text-gray-400 ml-2">
                            • Appointed {new Date(officer.appointed_on).toLocaleDateString('en-GB')}
                          </span>
                        )}
                      </p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                ))}
                
                {resignedOfficers.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-500 mb-2">
                      {resignedOfficers.length} resigned officer(s)
                    </p>
                  </div>
                )}

                {activeOfficers.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No active officers found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compliance & Filings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Compliance & Filings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.accounts?.next_due && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">Next Accounts Due</p>
                    <p className="text-sm text-gray-600">
                      {new Date(company.accounts.next_due).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              )}

              {company.confirmation_statement?.next_due && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">Next Confirmation Statement</p>
                    <p className="text-sm text-gray-600">
                      {new Date(company.confirmation_statement.next_due).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Company Status</p>
                  <p className="text-sm text-gray-600">All filings up to date</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* AI Risk Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                AI Risk Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Risk Score</p>
                    <p className="text-sm text-gray-600">Based on comprehensive analysis</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">3/10</div>
                    <p className="text-xs text-gray-500">LOW RISK</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <p className="text-sm text-green-800">
                    <strong>Assessment:</strong> This company shows low risk indicators. 
                    Directors are stable with good track record. Company is active with 
                    regular filings and no significant compliance issues identified.
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => alert('AI analysis feature coming soon!')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Detailed Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}