"use client";

import { useState } from "react";
import { useSession } from "@/lib/use-simple-auth";
import { DashboardLayout } from "@/components/navigation/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin,
  Map,
  BarChart3,
  TrendingUp,
  Building2,
  Users,
  Activity,
  Target,
  Eye,
  Download,
  Filter,
  Compass,
  Globe,
  Navigation,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

export default function GeographicInsightsPage() {
  const { data: session, isPending } = useSession();
  const [region, setRegion] = useState("all");
  const [metric, setMetric] = useState("formations");
  const [timeframe, setTimeframe] = useState("12months");

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
          <p className="text-muted-foreground">Please sign in to access Geographic Insights</p>
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
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const regionalData = [
    {
      region: "London",
      formations: "45,234",
      activeCompanies: "1,234,567",
      growth: "+8.2%",
      trend: "up",
      density: "Very High",
      topIndustries: ["Financial Services", "Technology", "Professional Services"]
    },
    {
      region: "South East",
      formations: "18,756",
      activeCompanies: "856,432",
      growth: "+5.7%",
      trend: "up",
      density: "High",
      topIndustries: ["Technology", "Manufacturing", "Retail"]
    },
    {
      region: "North West",
      formations: "12,345",
      activeCompanies: "567,890",
      growth: "+3.4%",
      trend: "up",
      density: "Medium",
      topIndustries: ["Manufacturing", "Retail", "Healthcare"]
    },
    {
      region: "West Midlands",
      formations: "9,876",
      activeCompanies: "432,109",
      growth: "+2.1%",
      trend: "up",
      density: "Medium",
      topIndustries: ["Manufacturing", "Automotive", "Technology"]
    },
    {
      region: "Scotland",
      formations: "8,765",
      activeCompanies: "398,765",
      growth: "+4.3%",
      trend: "up",
      density: "Medium",
      topIndustries: ["Energy", "Technology", "Tourism"]
    }
  ];

  const cityHotspots = [
    {
      city: "London",
      postcode: "EC2V",
      companies: "15,234",
      description: "Financial district with major banks and fintech companies"
    },
    {
      city: "Manchester",
      postcode: "M1",
      companies: "3,456",
      description: "Technology and digital media hub"
    },
    {
      city: "Edinburgh",
      postcode: "EH1",
      companies: "2,789",
      description: "Financial services and tourism center"
    },
    {
      city: "Bristol",
      postcode: "BS1",
      companies: "2,345",
      description: "Aerospace and creative industries cluster"
    }
  ];

  return (
    <DashboardLayout
      pageTitle="Geographic Insights"
      pageDescription="Location-based analysis of UK business activity and regional trends"
      actions={
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="12months">12 Months</SelectItem>
              <SelectItem value="24months">24 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Map Data
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Geographic Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Regions</p>
                  <p className="text-2xl font-bold text-blue-900">12</p>
                  <p className="text-xs text-blue-700 mt-1">UK regions analyzed</p>
                </div>
                <Map className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Business Hotspots</p>
                  <p className="text-2xl font-bold text-green-900">247</p>
                  <p className="text-xs text-green-700 mt-1">High-density areas</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Growing Cities</p>
                  <p className="text-2xl font-bold text-purple-900">89</p>
                  <p className="text-xs text-purple-700 mt-1">Above-average growth</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">New Formations</p>
                  <p className="text-2xl font-bold text-orange-900">94,976</p>
                  <p className="text-xs text-orange-700 mt-1">Last 12 months</p>
                </div>
                <Building2 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Analysis Tabs */}
        <Tabs defaultValue="regions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
            <TabsTrigger value="hotspots">Business Hotspots</TabsTrigger>
            <TabsTrigger value="trends">Location Trends</TabsTrigger>
            <TabsTrigger value="insights">Geographic Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Regional Performance
                </CardTitle>
                <CardDescription>Business formation and growth by UK region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalData.map((region, index) => (
                    <div key={index} className="p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-lg">{region.region}</h3>
                            <Badge variant="outline" className="bg-gray-50">
                              {region.density} Density
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                            <div>
                              <p><strong>New Formations:</strong></p>
                              <p className="text-lg font-semibold text-foreground">{region.formations}</p>
                            </div>
                            <div>
                              <p><strong>Active Companies:</strong></p>
                              <p className="text-lg font-semibold text-foreground">{region.activeCompanies}</p>
                            </div>
                            <div>
                              <p><strong>Growth Rate:</strong></p>
                              <div className="flex items-center gap-1">
                                {getTrendIcon(region.trend)}
                                <span className={`font-semibold ${getTrendColor(region.trend)}`}>
                                  {region.growth}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p><strong>Top Industries:</strong></p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {region.topIndustries.slice(0, 2).map((industry, industryIndex) => (
                                  <Badge key={industryIndex} variant="outline" className="text-xs">
                                    {industry}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotspots" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Business Concentration Hotspots
                </CardTitle>
                <CardDescription>Areas with highest business density and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cityHotspots.map((hotspot, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">{hotspot.city}</h3>
                        <Badge variant="outline">{hotspot.postcode}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Companies:</span>
                          <span className="font-semibold">{hotspot.companies}</span>
                        </div>
                        <p className="text-muted-foreground text-xs">{hotspot.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map Placeholder */}
                <div className="mt-6 p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                  <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Interactive Business Map</h3>
                  <p className="text-gray-500 mb-4">
                    Explore UK business locations with our interactive heat map showing company density and growth patterns.
                  </p>
                  <Button variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Launch Interactive Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Location Trends
                  </CardTitle>
                  <CardDescription>Emerging patterns in business location choices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold text-green-900">Northern Powerhouse Growth</h4>
                    <p className="text-sm text-green-800 mt-1">
                      Manchester, Leeds, and Liverpool show accelerated business formation rates.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold text-blue-900">Tech Corridor Development</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Cambridge-London-Oxford triangle maintains dominance in tech startups.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold text-purple-900">Remote Work Impact</h4>
                    <p className="text-sm text-purple-800 mt-1">
                      Coastal and rural areas see increased business registrations.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold text-orange-900">Green Energy Clusters</h4>
                    <p className="text-sm text-orange-800 mt-1">
                      Scotland and Wales lead in renewable energy company formations.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="w-5 h-5" />
                    Migration Patterns
                  </CardTitle>
                  <CardDescription>Business relocation and expansion trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      movement: "London → Manchester",
                      companies: "234",
                      reason: "Lower costs, talent access",
                      trend: "up"
                    },
                    {
                      movement: "London → Edinburgh",
                      companies: "156",
                      reason: "Financial services expansion",
                      trend: "up"
                    },
                    {
                      movement: "Birmingham → London",
                      companies: "89",
                      reason: "Market access, investment",
                      trend: "neutral"
                    },
                    {
                      movement: "Bristol → Cardiff",
                      companies: "67",
                      reason: "Government incentives",
                      trend: "up"
                    }
                  ].map((migration, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{migration.movement}</p>
                        <p className="text-xs text-muted-foreground">{migration.reason}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{migration.companies}</span>
                        {getTrendIcon(migration.trend)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Key Geographic Insights
                  </CardTitle>
                  <CardDescription>AI-powered analysis of location-based business patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border-l-4 border-red-500 bg-red-50">
                    <h4 className="font-semibold text-red-900">London Dominance</h4>
                    <p className="text-sm text-red-800 mt-1">
                      47% of all new UK company formations still occur in Greater London, despite rising costs.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                    <h4 className="font-semibold text-yellow-900">Regional Specialization</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      Different regions show distinct industry clusters: Tech in Cambridge, Auto in Midlands, Energy in Scotland.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50">
                    <h4 className="font-semibold text-indigo-900">Post-Brexit Patterns</h4>
                    <p className="text-sm text-indigo-800 mt-1">
                      Northern cities gain prominence as companies seek EU proximity and cost advantages.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Location Intelligence
                  </CardTitle>
                  <CardDescription>Strategic insights for business location decisions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">Best Growth Markets</span>
                      <Badge className="bg-green-100 text-green-800">Manchester, Edinburgh</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Innovation Hubs</span>
                      <Badge className="bg-blue-100 text-blue-800">Cambridge, Bristol</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span className="text-sm font-medium">Cost-Effective Locations</span>
                      <Badge className="bg-purple-100 text-purple-800">Newcastle, Cardiff</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="text-sm font-medium">Talent Pools</span>
                      <Badge className="bg-orange-100 text-orange-800">London, Birmingham</Badge>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold mb-2">Location Recommendation Engine</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get AI-powered suggestions for optimal business locations based on your industry and requirements.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Target className="w-4 h-4 mr-2" />
                      Find Optimal Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}