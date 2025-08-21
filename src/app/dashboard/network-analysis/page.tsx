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
  Network,
  Users,
  Building2,
  Search,
  Activity,
  Share2,
  GitBranch,
  Target,
  Eye,
  Download,
  Filter,
  Zap,
  ArrowRight,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";

export default function NetworkAnalysisPage() {
  const { data: session, isPending } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [analysisType, setAnalysisType] = useState("ownership");
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

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
          <p className="text-muted-foreground">Please sign in to access Network Analysis</p>
        </div>
      </div>
    );
  }

  const networkConnections = [
    {
      id: "1",
      centrateCompany: "Global Holdings PLC",
      companyNumber: "12345678",
      connections: 45,
      type: "Ownership Network",
      strength: "Strong",
      description: "Complex ownership structure with multiple subsidiaries",
      lastUpdated: "2 hours ago"
    },
    {
      id: "2",
      centrateCompany: "Innovation Ventures Ltd",
      companyNumber: "87654321",
      connections: 23,
      type: "Director Network",
      strength: "Medium",
      description: "Shared directors across technology companies",
      lastUpdated: "1 day ago"
    },
    {
      id: "3",
      centrateCompany: "London Business Group",
      companyNumber: "11223344",
      connections: 67,
      type: "Address Network",
      strength: "Strong",
      description: "Companies sharing registered addresses",
      lastUpdated: "3 hours ago"
    }
  ];

  const directorConnections = [
    {
      name: "John Smith",
      companies: ["TechStart Ltd", "Digital Solutions PLC", "Innovation Corp"],
      roles: ["Director", "CEO", "Chairman"],
      since: "2018",
      influence: "High"
    },
    {
      name: "Sarah Johnson",
      companies: ["Green Energy Ltd", "Sustainability Corp", "EcoTech PLC"],
      roles: ["Director", "CFO", "Director"],
      since: "2020",
      influence: "Medium"
    },
    {
      name: "Michael Brown",
      companies: ["Financial Services Ltd", "Investment Group PLC", "Capital Partners"],
      roles: ["Chairman", "Director", "Managing Director"],
      since: "2015",
      influence: "High"
    }
  ];

  const getStrengthColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'strong':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'weak':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInfluenceColor = (influence: string) => {
    switch (influence.toLowerCase()) {
      case 'high':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout
      pageTitle="Network Analysis"
      pageDescription="Discover business relationships and connections across UK companies"
      actions={
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Network
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            AI Analysis
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
              Network Discovery
            </CardTitle>
            <CardDescription>Search for companies and discover their business networks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter company name or director name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Analysis Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ownership">Ownership Networks</SelectItem>
                  <SelectItem value="directors">Director Networks</SelectItem>
                  <SelectItem value="address">Address Networks</SelectItem>
                  <SelectItem value="industry">Industry Networks</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Network className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Network Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Networks</p>
                  <p className="text-2xl font-bold text-blue-900">1,247</p>
                  <p className="text-xs text-blue-700 mt-1">Active connections</p>
                </div>
                <Network className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Key Directors</p>
                  <p className="text-2xl font-bold text-purple-900">3,456</p>
                  <p className="text-xs text-purple-700 mt-1">Multiple positions</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Strong Networks</p>
                  <p className="text-2xl font-bold text-green-900">89</p>
                  <p className="text-xs text-green-700 mt-1">High connectivity</p>
                </div>
                <GitBranch className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">New Connections</p>
                  <p className="text-2xl font-bold text-orange-900">127</p>
                  <p className="text-xs text-orange-700 mt-1">This month</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Analysis Tabs */}
        <Tabs defaultValue="networks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="networks">Company Networks</TabsTrigger>
            <TabsTrigger value="directors">Director Networks</TabsTrigger>
            <TabsTrigger value="insights">Network Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="networks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Discovered Networks
                </CardTitle>
                <CardDescription>Business networks based on ownership, directors, and addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {networkConnections.map((network) => (
                    <div key={network.id} className="p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-lg">{network.centrateCompany}</h3>
                            <Badge className={getStrengthColor(network.strength)}>
                              {network.strength} Network
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                            <div>
                              <p><strong>Company Number:</strong> {network.companyNumber}</p>
                              <p><strong>Network Type:</strong> {network.type}</p>
                            </div>
                            <div>
                              <p><strong>Connections:</strong> {network.connections} companies</p>
                              <p><strong>Updated:</strong> {network.lastUpdated}</p>
                            </div>
                            <div>
                              <p className="text-xs">{network.description}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Network
                          </Button>
                          <Button variant="outline" size="sm">
                            <Target className="w-4 h-4 mr-2" />
                            Analyze
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Key Directors & Officers
                </CardTitle>
                <CardDescription>Directors with multiple company positions and high network influence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {directorConnections.map((director, index) => (
                    <div key={index} className="p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-lg">{director.name}</h3>
                            <Badge className={getInfluenceColor(director.influence)}>
                              {director.influence} Influence
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                            <div>
                              <p><strong>Active Since:</strong> {director.since}</p>
                              <p><strong>Company Count:</strong> {director.companies.length}</p>
                            </div>
                            <div>
                              <p><strong>Primary Roles:</strong></p>
                              <div className="flex gap-1 mt-1">
                                {director.roles.slice(0, 2).map((role, roleIndex) => (
                                  <Badge key={roleIndex} variant="outline" className="text-xs">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-2">Connected Companies:</p>
                            <div className="flex flex-wrap gap-2">
                              {director.companies.map((company, companyIndex) => (
                                <div key={companyIndex} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                  <Building2 className="w-3 h-3" />
                                  {company}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <Network className="w-4 h-4 mr-2" />
                            Network Map
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Network Insights
                  </CardTitle>
                  <CardDescription>AI-powered analysis of business network patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold text-blue-900">Corporate Clustering</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Technology companies show high interconnectivity through shared directors and investors.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold text-green-900">Geographic Concentration</h4>
                    <p className="text-sm text-green-800 mt-1">
                      London-based networks demonstrate 40% higher connectivity than regional networks.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold text-orange-900">Industry Networks</h4>
                    <p className="text-sm text-orange-800 mt-1">
                      Financial services companies maintain the most complex ownership structures.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Network Activity
                  </CardTitle>
                  <CardDescription>Recent changes in business networks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      type: "New Connection",
                      description: "TechCorp acquired StartupLab Ltd",
                      impact: "High",
                      time: "2 hours ago"
                    },
                    {
                      type: "Director Change",
                      description: "John Smith appointed to Innovation Ltd",
                      impact: "Medium",
                      time: "1 day ago"
                    },
                    {
                      type: "Network Expansion",
                      description: "Global Holdings formed new subsidiary",
                      impact: "High",
                      time: "2 days ago"
                    },
                    {
                      type: "Address Change",
                      description: "5 companies moved to shared address",
                      impact: "Low",
                      time: "3 days ago"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.impact === 'High' ? 'bg-red-500' : 
                        activity.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.type}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}