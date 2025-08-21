"use client";

import { useState } from "react";
import { useSession } from "@/lib/use-simple-auth";
import { DashboardLayout } from "@/components/navigation/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText,
  Search,
  Filter,
  Building2,
  Eye,
  Plus,
  Star,
  Clock,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Network,
  MapPin,
  Users,
  Download,
  Copy,
  Edit,
  MoreHorizontal,
  Layout,
  Settings,
  Zap
} from "lucide-react";

export default function TemplatesPage() {
  const { data: session, isPending } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

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
          <p className="text-muted-foreground">Please sign in to access Templates</p>
        </div>
      </div>
    );
  }

  const getTemplateIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'company analysis':
        return <Building2 className="w-5 h-5" />;
      case 'market trends':
        return <TrendingUp className="w-5 h-5" />;
      case 'risk assessment':
        return <AlertTriangle className="w-5 h-5" />;
      case 'network analysis':
        return <Network className="w-5 h-5" />;
      case 'geographic insights':
        return <MapPin className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'company analysis':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'market trends':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'risk assessment':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'network analysis':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'geographic insights':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const reportTemplates = [
    {
      id: "1",
      name: "Comprehensive Company Analysis",
      description: "Deep-dive analysis template covering financials, governance, market position, and growth prospects",
      category: "Company Analysis",
      sections: 12,
      estimatedPages: "25-35",
      estimatedTime: "2-3 hours",
      difficulty: "Advanced",
      popularity: 4.8,
      uses: 1247,
      featured: true,
      lastUpdated: "2024-01-15",
      includes: [
        "Executive Summary",
        "Financial Performance",
        "Risk Assessment",
        "Market Analysis",
        "SWOT Analysis",
        "Recommendations"
      ]
    },
    {
      id: "2",
      name: "Due Diligence Checklist",
      description: "Systematic approach to company due diligence with comprehensive checklists and verification points",
      category: "Company Analysis",
      sections: 8,
      estimatedPages: "15-20",
      estimatedTime: "1-2 hours",
      difficulty: "Intermediate",
      popularity: 4.6,
      uses: 892,
      featured: false,
      lastUpdated: "2024-01-12",
      includes: [
        "Legal Structure",
        "Financial Health",
        "Compliance Status",
        "Key Personnel",
        "Risk Factors",
        "Verification"
      ]
    },
    {
      id: "3",
      name: "Industry Trend Analysis",
      description: "Market research template focusing on industry trends, competitive landscape, and growth opportunities",
      category: "Market Trends",
      sections: 10,
      estimatedPages: "20-28",
      estimatedTime: "2-3 hours",
      difficulty: "Advanced",
      popularity: 4.5,
      uses: 678,
      featured: true,
      lastUpdated: "2024-01-10",
      includes: [
        "Market Overview",
        "Growth Drivers",
        "Competitive Analysis",
        "Trend Identification",
        "Future Outlook",
        "Recommendations"
      ]
    },
    {
      id: "4",
      name: "Multi-Company Risk Portfolio",
      description: "Comprehensive risk assessment template for analyzing multiple companies in a portfolio",
      category: "Risk Assessment",
      sections: 15,
      estimatedPages: "30-45",
      estimatedTime: "3-4 hours",
      difficulty: "Expert",
      popularity: 4.7,
      uses: 456,
      featured: true,
      lastUpdated: "2024-01-08",
      includes: [
        "Risk Framework",
        "Individual Assessments",
        "Portfolio Risk",
        "Correlation Analysis",
        "Mitigation Strategies",
        "Monitoring Plan"
      ]
    },
    {
      id: "5",
      name: "Business Network Mapping",
      description: "Detailed analysis of business relationships, ownership structures, and network connections",
      category: "Network Analysis",
      sections: 9,
      estimatedPages: "18-25",
      estimatedTime: "2-3 hours",
      difficulty: "Advanced",
      popularity: 4.3,
      uses: 342,
      featured: false,
      lastUpdated: "2024-01-06",
      includes: [
        "Network Overview",
        "Key Relationships",
        "Ownership Structure",
        "Director Networks",
        "Influence Analysis",
        "Network Health"
      ]
    },
    {
      id: "6",
      name: "Regional Business Analysis",
      description: "Geographic analysis template for understanding regional business patterns and opportunities",
      category: "Geographic Insights",
      sections: 11,
      estimatedPages: "22-30",
      estimatedTime: "2-3 hours",
      difficulty: "Intermediate",
      popularity: 4.4,
      uses: 523,
      featured: false,
      lastUpdated: "2024-01-05",
      includes: [
        "Regional Overview",
        "Business Density",
        "Growth Patterns",
        "Industry Clusters",
        "Economic Indicators",
        "Opportunities"
      ]
    }
  ];

  const quickTemplates = [
    {
      id: "q1",
      name: "Quick Company Summary",
      description: "1-page executive summary template",
      category: "Company Analysis",
      pages: "1-2",
      time: "15-30 min"
    },
    {
      id: "q2",
      name: "Risk Alert Report",
      description: "Immediate risk notification template",
      category: "Risk Assessment",
      pages: "2-3",
      time: "20-45 min"
    },
    {
      id: "q3",
      name: "Market Snapshot",
      description: "Brief industry overview template",
      category: "Market Trends",
      pages: "3-5",
      time: "30-45 min"
    },
    {
      id: "q4",
      name: "Network Summary",
      description: "Key connections overview template",
      category: "Network Analysis",
      pages: "2-4",
      time: "25-40 min"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout
      pageTitle="Report Templates"
      pageDescription="Pre-built templates for generating comprehensive business intelligence reports"
      actions={
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Layout className="w-4 h-4 mr-2" />
            Template Builder
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Search & Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Templates
            </CardTitle>
            <CardDescription>Search and filter report templates by category and complexity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search templates by name, description, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="company">Company Analysis</SelectItem>
                  <SelectItem value="market">Market Trends</SelectItem>
                  <SelectItem value="risk">Risk Assessment</SelectItem>
                  <SelectItem value="network">Network Analysis</SelectItem>
                  <SelectItem value="geographic">Geographic Insights</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Recently Updated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="complexity">Complexity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Template Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Templates</p>
                  <p className="text-2xl font-bold text-blue-900">24</p>
                  <p className="text-xs text-blue-700 mt-1">Available</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Most Popular</p>
                  <p className="text-2xl font-bold text-green-900">4.8★</p>
                  <p className="text-xs text-green-700 mt-1">Average rating</p>
                </div>
                <Star className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Usage This Month</p>
                  <p className="text-2xl font-bold text-purple-900">1,247</p>
                  <p className="text-xs text-purple-700 mt-1">Reports generated</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Time Saved</p>
                  <p className="text-2xl font-bold text-orange-900">156h</p>
                  <p className="text-xs text-orange-700 mt-1">This month</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Tabs */}
        <Tabs defaultValue="comprehensive" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comprehensive">Comprehensive Templates</TabsTrigger>
            <TabsTrigger value="quick">Quick Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comprehensive" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              {reportTemplates.map((template) => (
                <Card key={template.id} className={`${template.featured ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''} hover:bg-accent/50 transition-colors`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTemplateIcon(template.category)}
                          <h3 className="font-semibold text-lg">{template.name}</h3>
                          {template.featured && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{template.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                          <div>
                            <p><strong>Sections:</strong> {template.sections}</p>
                            <p><strong>Pages:</strong> {template.estimatedPages}</p>
                          </div>
                          <div>
                            <p><strong>Time:</strong> {template.estimatedTime}</p>
                            <p><strong>Rating:</strong> {template.popularity}★</p>
                          </div>
                          <div>
                            <p><strong>Used:</strong> {template.uses.toLocaleString()} times</p>
                            <p><strong>Updated:</strong> {new Date(template.lastUpdated).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p><strong>Includes:</strong></p>
                            <div className="text-xs mt-1 space-y-1">
                              {template.includes.slice(0, 3).map((item, index) => (
                                <div key={index}>• {item}</div>
                              ))}
                              {template.includes.length > 3 && (
                                <div>• +{template.includes.length - 3} more</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <Button size="sm" className="w-full">
                          <Zap className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="flex-1">
                            <Copy className="w-4 h-4 mr-2" />
                            Clone
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1">
                            <Edit className="w-4 h-4 mr-2" />
                            Customize
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quick" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Report Templates
                </CardTitle>
                <CardDescription>Fast templates for immediate insights and summaries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickTemplates.map((template) => (
                    <div key={template.id} className="p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTemplateIcon(template.category)}
                          <h3 className="font-semibold">{template.name}</h3>
                        </div>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <p><strong>Pages:</strong> {template.pages}</p>
                        </div>
                        <div>
                          <p><strong>Time:</strong> {template.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Zap className="w-4 h-4 mr-2" />
                          Quick Start
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Template Builder CTA */}
                <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                  <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Create Custom Templates</h3>
                  <p className="text-gray-500 mb-4">
                    Build your own report templates with our drag-and-drop template builder. Save time with reusable formats tailored to your needs.
                  </p>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Launch Template Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}