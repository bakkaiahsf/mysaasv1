"use client";

import { useState } from "react";
import { useSession } from "@/lib/use-simple-auth";
import { DashboardLayout } from "@/components/navigation/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  BarChart3,
  PieChart,
  Target,
  Calendar,
  Building2,
  Users,
  DollarSign,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

export default function MarketTrendsPage() {
  const { data: session, isPending } = useSession();
  const [timeframe, setTimeframe] = useState("6months");
  const [industry, setIndustry] = useState("all");

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
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access Market Trends</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <DashboardLayout
      pageTitle="Market Trends"
      pageDescription="Industry analysis and market intelligence for UK companies"
      actions={
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">Export Report</Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Incorporations</p>
                  <p className="text-2xl font-bold">12,847</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon('up')}
                    <span className="text-sm text-green-600">+8.2%</span>
                  </div>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dissolutions</p>
                  <p className="text-2xl font-bold">8,234</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon('down')}
                    <span className="text-sm text-red-600">-3.1%</span>
                  </div>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Companies</p>
                  <p className="text-2xl font-bold">5.2M</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon('up')}
                    <span className="text-sm text-green-600">+2.4%</span>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Market Health</p>
                  <p className="text-2xl font-bold">Strong</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon('up')}
                    <span className="text-sm text-green-600">Stable</span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Industry Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Top Growing Industries
              </CardTitle>
              <CardDescription>Industries with highest growth rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Technology & Software", growth: "+15.2%", companies: "284,532", trend: "up" },
                { name: "Healthcare & Medical", growth: "+12.8%", companies: "156,789", trend: "up" },
                { name: "Financial Services", growth: "+9.4%", companies: "198,234", trend: "up" },
                { name: "E-commerce & Retail", growth: "+7.6%", companies: "342,156", trend: "up" },
                { name: "Green Energy", growth: "+18.9%", companies: "89,456", trend: "up" }
              ].map((industry) => (
                <div key={industry.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{industry.name}</p>
                    <p className="text-sm text-muted-foreground">{industry.companies} companies</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTrendColor(industry.trend)}>
                      {getTrendIcon(industry.trend)}
                      {industry.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Regional Performance
              </CardTitle>
              <CardDescription>Company formation by region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { region: "London", formations: "4,234", percentage: "33.0%", trend: "up" },
                { region: "Manchester", formations: "1,876", percentage: "14.6%", trend: "up" },
                { region: "Birmingham", formations: "1,523", percentage: "11.9%", trend: "neutral" },
                { region: "Edinburgh", formations: "1,234", percentage: "9.6%", trend: "up" },
                { region: "Bristol", formations: "987", percentage: "7.7%", trend: "down" }
              ].map((region) => (
                <div key={region.region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{region.region}</p>
                    <p className="text-sm text-muted-foreground">{region.formations} new companies</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{region.percentage}</span>
                    {getTrendIcon(region.trend)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Key Market Insights
            </CardTitle>
            <CardDescription>AI-powered analysis of current market conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-semibold text-blue-900">Technology Sector Boom</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    AI and software companies are experiencing unprecedented growth with a 15.2% increase in formations.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-semibold text-green-900">Sustainability Focus</h4>
                  <p className="text-sm text-green-800 mt-1">
                    Green energy companies show the highest growth rate at 18.9%, reflecting increased environmental focus.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <h4 className="font-semibold text-orange-900">Regional Concentration</h4>
                  <p className="text-sm text-orange-800 mt-1">
                    London continues to dominate with 33% of all new company formations, but other cities are catching up.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                  <h4 className="font-semibold text-purple-900">Healthcare Innovation</h4>
                  <p className="text-sm text-purple-800 mt-1">
                    Post-pandemic healthcare innovation drives 12.8% growth in medical technology companies.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}