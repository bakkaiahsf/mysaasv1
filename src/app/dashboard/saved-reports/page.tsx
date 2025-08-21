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
  Calendar,
  Building2,
  Download,
  Eye,
  Share2,
  Trash2,
  Star,
  Clock,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Network,
  MapPin,
  Plus,
  MoreHorizontal
} from "lucide-react";

export default function SavedReportsPage() {
  const { data: session, isPending } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

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
          <p className="text-muted-foreground">Please sign in to access Saved Reports</p>
        </div>
      </div>
    );
  }

  const getReportIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'company analysis':
        return <Building2 className="w-4 h-4" />;
      case 'market trends':
        return <TrendingUp className="w-4 h-4" />;
      case 'risk assessment':
        return <AlertTriangle className="w-4 h-4" />;
      case 'network analysis':
        return <Network className="w-4 h-4" />;
      case 'geographic insights':
        return <MapPin className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getReportColor = (type: string) => {
    switch (type.toLowerCase()) {
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

  const savedReports = [
    {
      id: "1",
      title: "TechStart Solutions Ltd - Comprehensive Analysis",
      type: "Company Analysis",
      company: "TechStart Solutions Ltd",
      companyNumber: "12345678",
      createdDate: "2024-01-15",
      lastModified: "2024-01-16",
      pages: 24,
      starred: true,
      size: "2.3 MB",
      status: "Complete"
    },
    {
      id: "2",
      title: "UK Technology Sector - Q4 2023 Trends",
      type: "Market Trends",
      company: null,
      companyNumber: null,
      createdDate: "2024-01-14",
      lastModified: "2024-01-14",
      pages: 18,
      starred: false,
      size: "1.8 MB",
      status: "Complete"
    },
    {
      id: "3",
      title: "High-Risk Companies - Manufacturing Sector",
      type: "Risk Assessment",
      company: null,
      companyNumber: null,
      createdDate: "2024-01-13",
      lastModified: "2024-01-15",
      pages: 32,
      starred: true,
      size: "4.1 MB",
      status: "Complete"
    },
    {
      id: "4",
      title: "Innovation Networks - Cambridge Tech Cluster",
      type: "Network Analysis",
      company: null,
      companyNumber: null,
      createdDate: "2024-01-12",
      lastModified: "2024-01-12",
      pages: 15,
      starred: false,
      size: "1.2 MB",
      status: "Complete"
    },
    {
      id: "5",
      title: "London Business Districts - Geographic Analysis",
      type: "Geographic Insights",
      company: null,
      companyNumber: null,
      createdDate: "2024-01-11",
      lastModified: "2024-01-13",
      pages: 28,
      starred: false,
      size: "3.5 MB",
      status: "Processing"
    }
  ];

  const reportTemplates = [
    {
      id: "t1",
      name: "Company Due Diligence",
      description: "Comprehensive analysis template for company evaluation",
      sections: 8,
      estimatedPages: "20-25",
      category: "Company Analysis"
    },
    {
      id: "t2",
      name: "Market Research Report",
      description: "Industry analysis and market trends template",
      sections: 6,
      estimatedPages: "15-20",
      category: "Market Trends"
    },
    {
      id: "t3",
      name: "Risk Assessment Portfolio",
      description: "Multi-company risk evaluation template",
      sections: 10,
      estimatedPages: "25-35",
      category: "Risk Assessment"
    },
    {
      id: "t4",
      name: "Network Mapping Report",
      description: "Business relationship and connection analysis",
      sections: 7,
      estimatedPages: "18-22",
      category: "Network Analysis"
    }
  ];

  return (
    <DashboardLayout
      pageTitle="Saved Reports"
      pageDescription="Access and manage your generated business intelligence reports"
      actions={
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Reports
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Report
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
              Search Reports
            </CardTitle>
            <CardDescription>Find and filter your saved reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search reports by title, company, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
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
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Reports</p>
                  <p className="text-2xl font-bold text-blue-900">47</p>
                  <p className="text-xs text-blue-700 mt-1">All time</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">This Month</p>
                  <p className="text-2xl font-bold text-green-900">12</p>
                  <p className="text-xs text-green-700 mt-1">New reports</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Starred</p>
                  <p className="text-2xl font-bold text-yellow-900">8</p>
                  <p className="text-xs text-yellow-700 mt-1">Favorites</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Storage Used</p>
                  <p className="text-2xl font-bold text-purple-900">234 MB</p>
                  <p className="text-xs text-purple-700 mt-1">of 2 GB</p>
                </div>
                <Download className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports and Templates */}
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Saved Reports
                </CardTitle>
                <CardDescription>Generated business intelligence reports and analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedReports.map((report) => (
                    <div key={report.id} className="p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getReportIcon(report.type)}
                            <h3 className="font-semibold text-lg">{report.title}</h3>
                            {report.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            <Badge className={getReportColor(report.type)}>
                              {report.type}
                            </Badge>
                            <Badge variant="outline" className={
                              report.status === 'Complete' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                            }>
                              {report.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                            <div>
                              {report.company && (
                                <>
                                  <p><strong>Company:</strong> {report.company}</p>
                                  <p><strong>Number:</strong> {report.companyNumber}</p>
                                </>
                              )}
                              {!report.company && <p><strong>Type:</strong> Sector Analysis</p>}
                            </div>
                            <div>
                              <p className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <strong>Created:</strong> {new Date(report.createdDate).toLocaleDateString()}
                              </p>
                              <p className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <strong>Modified:</strong> {new Date(report.lastModified).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p><strong>Pages:</strong> {report.pages}</p>
                              <p><strong>Size:</strong> {report.size}</p>
                            </div>
                            <div className="text-xs">
                              <p className="mb-1">Report includes:</p>
                              {report.type === 'Company Analysis' && (
                                <div className="space-y-1">
                                  <div>• Financial overview</div>
                                  <div>• Risk assessment</div>
                                  <div>• Director analysis</div>
                                </div>
                              )}
                              {report.type === 'Market Trends' && (
                                <div className="space-y-1">
                                  <div>• Growth patterns</div>
                                  <div>• Industry insights</div>
                                  <div>• Competitive analysis</div>
                                </div>
                              )}
                              {report.type === 'Risk Assessment' && (
                                <div className="space-y-1">
                                  <div>• Risk scoring</div>
                                  <div>• Compliance check</div>
                                  <div>• Recommendations</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Report Templates
                </CardTitle>
                <CardDescription>Pre-built templates for common business intelligence reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getReportIcon(template.category)}
                          <h3 className="font-semibold">{template.name}</h3>
                        </div>
                        <Badge className={getReportColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <p><strong>Sections:</strong> {template.sections}</p>
                        </div>
                        <div>
                          <p><strong>Pages:</strong> {template.estimatedPages}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Plus className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}