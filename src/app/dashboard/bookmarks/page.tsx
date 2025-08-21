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
  Bookmark,
  Search,
  Building2,
  Eye,
  Trash2,
  Star,
  Clock,
  Calendar,
  MapPin,
  Users,
  BarChart3,
  Filter,
  Download,
  Share2,
  Plus,
  FolderPlus,
  Tag,
  Heart,
  History,
  Archive,
  MoreHorizontal
} from "lucide-react";

export default function BookmarksPage() {
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
          <p className="text-muted-foreground">Please sign in to access Saved & Bookmarks</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dissolved':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'liquidation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const bookmarkedCompanies = [
    {
      id: "1",
      company: "TechStart Solutions Ltd",
      companyNumber: "12345678",
      status: "Active",
      industry: "Technology",
      location: "London",
      dateBookmarked: "2024-01-15",
      lastViewed: "2024-01-16",
      notes: "High-growth potential, monitoring for investment opportunities",
      tags: ["Technology", "Startup", "High-Growth"],
      starred: true,
      folder: "Investment Targets"
    },
    {
      id: "2",
      company: "Green Energy Corp",
      companyNumber: "87654321",
      status: "Active",
      industry: "Energy",
      location: "Edinburgh",
      dateBookmarked: "2024-01-14",
      lastViewed: "2024-01-15",
      notes: "Renewable energy leader, strong ESG credentials",
      tags: ["Energy", "ESG", "Renewable"],
      starred: false,
      folder: "ESG Portfolio"
    },
    {
      id: "3",
      company: "Digital Marketing Hub",
      companyNumber: "11223344",
      status: "Active",
      industry: "Marketing",
      location: "Manchester",
      dateBookmarked: "2024-01-13",
      lastViewed: "2024-01-14",
      notes: "Competitor analysis - strong digital presence",
      tags: ["Marketing", "Competitor", "Digital"],
      starred: true,
      folder: "Competitive Analysis"
    },
    {
      id: "4",
      company: "Financial Services Pro",
      companyNumber: "55667788",
      status: "Active",
      industry: "Financial",
      location: "London",
      dateBookmarked: "2024-01-12",
      lastViewed: "2024-01-13",
      notes: "Potential partnership opportunity",
      tags: ["Financial", "Partnership", "B2B"],
      starred: false,
      folder: "Partnership Opportunities"
    }
  ];

  const savedSearches = [
    {
      id: "s1",
      name: "London Tech Startups",
      query: "technology startups London",
      filters: "Active companies, Technology sector, London",
      results: 2847,
      lastRun: "2024-01-16",
      frequency: "Weekly",
      alerts: true
    },
    {
      id: "s2",
      name: "High-Risk Manufacturing",
      query: "manufacturing companies high risk",
      filters: "Risk score > 7, Manufacturing sector",
      results: 156,
      lastRun: "2024-01-15",
      frequency: "Daily",
      alerts: true
    },
    {
      id: "s3",
      name: "Green Energy Growth",
      query: "renewable energy companies",
      filters: "Active, Energy sector, Founded after 2020",
      results: 423,
      lastRun: "2024-01-14",
      frequency: "Monthly",
      alerts: false
    }
  ];

  const folders = [
    { name: "Investment Targets", count: 12, color: "blue" },
    { name: "ESG Portfolio", count: 8, color: "green" },
    { name: "Competitive Analysis", count: 15, color: "red" },
    { name: "Partnership Opportunities", count: 6, color: "purple" },
    { name: "High-Risk Monitoring", count: 9, color: "orange" }
  ];

  const getFolderColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      red: "bg-red-100 text-red-800 border-red-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colors[color] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <DashboardLayout
      pageTitle="Saved & Bookmarks"
      pageDescription="Manage your saved companies, searches, and business intelligence collections"
      actions={
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Bookmark
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
              Search Bookmarks
            </CardTitle>
            <CardDescription>Find your saved companies and searches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search bookmarks, companies, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="companies">Companies Only</SelectItem>
                  <SelectItem value="searches">Saved Searches</SelectItem>
                  <SelectItem value="starred">Starred Items</SelectItem>
                  <SelectItem value="recent">Recent Activity</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="starred">Starred First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Bookmarks</p>
                  <p className="text-2xl font-bold text-blue-900">47</p>
                  <p className="text-xs text-blue-700 mt-1">Companies saved</p>
                </div>
                <Bookmark className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Saved Searches</p>
                  <p className="text-2xl font-bold text-green-900">12</p>
                  <p className="text-xs text-green-700 mt-1">Active queries</p>
                </div>
                <Search className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Starred Items</p>
                  <p className="text-2xl font-bold text-yellow-900">18</p>
                  <p className="text-xs text-yellow-700 mt-1">Priority items</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Folders</p>
                  <p className="text-2xl font-bold text-purple-900">5</p>
                  <p className="text-xs text-purple-700 mt-1">Organized collections</p>
                </div>
                <Archive className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookmarks Tabs */}
        <Tabs defaultValue="companies" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="searches">Saved Searches</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Bookmarked Companies
                </CardTitle>
                <CardDescription>Companies you've saved for future reference and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookmarkedCompanies.map((bookmark) => (
                    <div key={bookmark.id} className="p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-lg">{bookmark.company}</h3>
                            {bookmark.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            <Badge className={getStatusColor(bookmark.status)}>
                              {bookmark.status}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {bookmark.folder}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                            <div>
                              <p><strong>Company Number:</strong> {bookmark.companyNumber}</p>
                              <p><strong>Industry:</strong> {bookmark.industry}</p>
                            </div>
                            <div>
                              <p className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <strong>Location:</strong> {bookmark.location}
                              </p>
                              <p className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <strong>Bookmarked:</strong> {new Date(bookmark.dateBookmarked).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <strong>Last Viewed:</strong> {new Date(bookmark.lastViewed).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {bookmark.notes && (
                            <div className="mb-3">
                              <p className="text-sm"><strong>Notes:</strong> {bookmark.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {bookmark.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Company
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Generate Report
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

          <TabsContent value="searches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Saved Searches
                </CardTitle>
                <CardDescription>Your saved search queries and automated alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedSearches.map((search) => (
                    <div key={search.id} className="p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Search className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-lg">{search.name}</h3>
                            {search.alerts && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Alerts On
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                            <div>
                              <p><strong>Query:</strong> {search.query}</p>
                              <p><strong>Filters:</strong> {search.filters}</p>
                            </div>
                            <div>
                              <p><strong>Results:</strong> {search.results.toLocaleString()}</p>
                              <p><strong>Frequency:</strong> {search.frequency}</p>
                            </div>
                            <div>
                              <p><strong>Last Run:</strong> {new Date(search.lastRun).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Run Search
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export Results
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

          <TabsContent value="folders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Bookmark Folders
                </CardTitle>
                <CardDescription>Organize your bookmarks into themed collections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folders.map((folder, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Archive className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">{folder.name}</h3>
                        <Badge className={getFolderColor(folder.color)}>
                          {folder.count}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {folder.count} bookmarked companies
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Folder Card */}
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                    <div className="text-center">
                      <FolderPlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-600 mb-1">Create New Folder</h3>
                      <p className="text-sm text-gray-500">Organize your bookmarks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your recent bookmark and search activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    action: "Bookmarked company",
                    target: "TechStart Solutions Ltd",
                    time: "2 hours ago",
                    icon: <Bookmark className="w-4 h-4" />,
                    color: "blue"
                  },
                  {
                    action: "Updated search",
                    target: "London Tech Startups",
                    time: "1 day ago",
                    icon: <Search className="w-4 h-4" />,
                    color: "green"
                  },
                  {
                    action: "Starred company",
                    target: "Digital Marketing Hub",
                    time: "2 days ago",
                    icon: <Star className="w-4 h-4" />,
                    color: "yellow"
                  },
                  {
                    action: "Created folder",
                    target: "ESG Portfolio",
                    time: "3 days ago",
                    icon: <Archive className="w-4 h-4" />,
                    color: "purple"
                  },
                  {
                    action: "Removed bookmark",
                    target: "Old Company Ltd",
                    time: "1 week ago",
                    icon: <Trash2 className="w-4 h-4" />,
                    color: "red"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      activity.color === 'green' ? 'bg-green-100 text-green-600' :
                      activity.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                      activity.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.target}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}