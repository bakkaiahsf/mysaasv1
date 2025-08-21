"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/use-simple-auth";
import { UserProfile } from "@/components/auth/user-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/navigation/dashboard-layout";
import { useSearchParams } from "next/navigation";
import { 
  Lock, 
  Search, 
  TrendingUp, 
  Users, 
  Activity,
  Calendar,
  Clock,
  Star,
  BarChart3,
  FileText,
  Bookmark,
  Plus,
  Download,
  Eye
} from "lucide-react";
import { AdvancedCompanySearch } from "@/components/advanced-company-search";
import { CompanyKYBCards } from "@/components/company-kyb-cards";
import { CompanyFourCardDashboard } from "@/components/company-four-card-dashboard";
import { CompanyReportExport } from "@/components/company-report-export";
import { CompanyComparison } from "@/components/company-comparison";
import { CompanySearchResult } from "@/lib/companies-house";

export default function DashboardPage() {
  const { data: session, isPending, isAuthenticated } = useSession();
  const searchParams = useSearchParams();
  const [selectedCompany, setSelectedCompany] = useState<CompanySearchResult | null>(null);
  const [comparisonCompanies, setComparisonCompanies] = useState<CompanySearchResult[]>([]);
  const [view, setView] = useState<'dashboard' | 'details' | 'comparison' | 'export'>('dashboard');

  // Handle company selection from URL parameters
  useEffect(() => {
    const companyNumber = searchParams?.get('company');
    if (companyNumber && isAuthenticated && session) {
      // Fetch company details and set as selected
      fetchCompanyDetails(companyNumber);
    }
  }, [searchParams, session, isAuthenticated]);

  const fetchCompanyDetails = async (companyNumber: string) => {
    try {
      const response = await fetch(`/api/companies/search?q=${companyNumber}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const company = data.items.find((c: CompanySearchResult) => 
          c.company_number === companyNumber
        ) || data.items[0];
        
        setSelectedCompany(company);
        setView('details');
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !session?.user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Protected Dashboard</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access InsightUK's powerful company intelligence tools
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  const handleCompanySelect = (company: CompanySearchResult) => {
    setSelectedCompany(company);
    setView('details');
  };

  const handleCompareCompanies = (companies: CompanySearchResult[]) => {
    setComparisonCompanies(companies);
    setView('comparison');
  };

  const handleBackToDashboard = () => {
    setSelectedCompany(null);
    setComparisonCompanies([]);
    setView('dashboard');
  };

  const handleViewFullReport = () => {
    setView('export');
  };

  if (view === 'details' && selectedCompany) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <CompanyFourCardDashboard 
          company={selectedCompany}
        />
      </div>
    );
  }

  if (view === 'comparison' && comparisonCompanies.length > 0) {
    return (
      <DashboardLayout
        pageTitle="Company Comparison"
        pageDescription={`Comparing ${comparisonCompanies.length} companies`}
        showQuickActions={false}
        actions={
          <Button variant="outline" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        }
      >
        <CompanyComparison 
          companies={comparisonCompanies}
          onBack={handleBackToDashboard}
          onRemoveCompany={(companyNumber) => {
            const filtered = comparisonCompanies.filter(c => c.company_number !== companyNumber);
            if (filtered.length < 2) {
              handleBackToDashboard();
            } else {
              setComparisonCompanies(filtered);
            }
          }}
        />
      </DashboardLayout>
    );
  }

  if (view === 'export' && selectedCompany) {
    return (
      <DashboardLayout
        pageTitle="Export Report"
        pageDescription={`${selectedCompany.title} - Comprehensive KYB Report`}
        showQuickActions={false}
      >
        <CompanyReportExport 
          company={selectedCompany}
          onBackToDashboard={handleBackToDashboard}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      pageTitle="BRITSAI Dashboard"
      pageDescription="Comprehensive UK company intelligence at your fingertips"
      actions={
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-semibold">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
            <Badge variant="outline" className="mt-1">Pro User</Badge>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
      
      {/* Welcome Section */}
      <div className="text-center py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Welcome to BRITSAI</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover comprehensive UK company intelligence with powerful AI-driven insights
          </p>
          
          {/* Quick Access Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <Search className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900">Advanced Search</h3>
              <p className="text-sm text-blue-700 mt-2">Search 5.2M+ UK companies with powerful filters</p>
            </div>
            
            <div className="p-6 rounded-lg border bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900">AI Insights</h3>
              <p className="text-sm text-purple-700 mt-2">Generate detailed reports with AI analysis</p>
            </div>
            
            <div className="p-6 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900">Market Analytics</h3>
              <p className="text-sm text-green-700 mt-2">Track trends and assess business risks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Interface */}
      <AdvancedCompanySearch 
        onCompanySelect={handleCompanySelect}
        onCompareCompanies={handleCompareCompanies}
      />

      {/* Getting Started Guide */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Maximize your company intelligence research with these powerful features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-xs">1</span>
                </div>
                <div>
                  <p className="font-medium">Start with Advanced Search</p>
                  <p className="text-muted-foreground">Use company names, numbers, or keywords to find specific businesses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-xs">2</span>
                </div>
                <div>
                  <p className="font-medium">Apply Smart Filters</p>
                  <p className="text-muted-foreground">Filter by company status, type, and creation date for precise results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-xs">3</span>
                </div>
                <div>
                  <p className="font-medium">Generate AI Reports</p>
                  <p className="text-muted-foreground">Get comprehensive business insights and risk assessments instantly</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-xs">4</span>
                </div>
                <div>
                  <p className="font-medium">Compare Companies</p>
                  <p className="text-muted-foreground">Select multiple companies for side-by-side analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-xs">5</span>
                </div>
                <div>
                  <p className="font-medium">Save & Bookmark</p>
                  <p className="text-muted-foreground">Keep track of important companies and search results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-xs">6</span>
                </div>
                <div>
                  <p className="font-medium">Explore Analytics</p>
                  <p className="text-muted-foreground">Discover market trends, network analysis, and geographic insights</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
