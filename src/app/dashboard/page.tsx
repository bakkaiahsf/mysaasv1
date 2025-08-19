"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/navigation/dashboard-layout";
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
import { CompanyDetails } from "@/components/company-details";
import { CompanyComparison } from "@/components/company-comparison";
import { CompanySearchResult } from "@/lib/companies-house";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [selectedCompany, setSelectedCompany] = useState<CompanySearchResult | null>(null);
  const [comparisonCompanies, setComparisonCompanies] = useState<CompanySearchResult[]>([]);
  const [view, setView] = useState<'dashboard' | 'details' | 'comparison'>('dashboard');

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

  if (view === 'details' && selectedCompany) {
    return (
      <DashboardLayout
        pageTitle={selectedCompany.title}
        pageDescription={`Company Number: ${selectedCompany.company_number}`}
        showQuickActions={false}
        actions={
          <Button variant="outline" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        }
      >
        <CompanyDetails 
          company={selectedCompany} 
          onBack={handleBackToDashboard}
        />
      </DashboardLayout>
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

  return (
    <DashboardLayout
      pageTitle="BRITSAI Dashboard"
      pageDescription="Comprehensive UK company intelligence at your fingertips"
      actions={
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-semibold">{session.user.name}</p>
            <Badge variant="outline" className="mt-1">Pro User</Badge>
          </div>
        </div>
      }
    >
      <div className="space-y-8">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Searches</p>
                <p className="text-2xl font-bold text-blue-900">127</p>
              </div>
              <Search className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">AI Reports</p>
                <p className="text-2xl font-bold text-purple-900">43</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Bookmarks</p>
                <p className="text-2xl font-bold text-green-900">18</p>
              </div>
              <Bookmark className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">This Month</p>
                <p className="text-2xl font-bold text-orange-900">+24%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest company research activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Generated AI report for Apple Inc</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Bookmarked Microsoft Corporation</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Searched for "Tesla Motors"</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Active Companies</span>
              <span className="font-semibold">5.2M</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Search Speed</span>
              <span className="font-semibold">&lt; 2s</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Data Accuracy</span>
              <span className="font-semibold">99.9%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Last Update</span>
              <span className="font-semibold">Live</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Search Interface */}
      <AdvancedCompanySearch 
        onCompanySelect={handleCompanySelect}
        onCompareCompanies={handleCompareCompanies}
      />

      {/* Pro Tips */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Use company numbers</p>
                <p className="text-muted-foreground">Search by registration number for exact matches</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Filter results</p>
                <p className="text-muted-foreground">Use status and type filters to narrow down results</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Generate AI insights</p>
                <p className="text-muted-foreground">Get detailed analysis and risk assessments</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
