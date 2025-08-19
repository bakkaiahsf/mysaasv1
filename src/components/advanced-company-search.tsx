"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Building2, 
  Loader2, 
  Calendar, 
  MapPin, 
  Filter,
  History,
  Heart,
  MoreHorizontal,
  ArrowUpDown,
  GitCompare,
  Plus
} from "lucide-react";
import { CompanySearchResult, SearchResponse } from "@/lib/companies-house";

interface AdvancedCompanySearchProps {
  onCompanySelect: (company: CompanySearchResult) => void;
  onCompareCompanies?: (companies: CompanySearchResult[]) => void;
}

export function AdvancedCompanySearch({ onCompanySelect, onCompareCompanies }: AdvancedCompanySearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    sortBy: "relevance"
  });
  const [recentSearches] = useState([
    "Apple Inc",
    "Microsoft",
    "Tesla Motors",
    "British Petroleum"
  ]);
  const [favorites] = useState<string[]>([]);
  const [selectedForComparison, setSelectedForComparison] = useState<CompanySearchResult[]>([]);

  const searchCompanies = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}&items_per_page=20`);
      
      if (!response.ok) {
        throw new Error('Failed to search companies');
      }

      const data: SearchResponse = await response.json();
      let filteredResults = data.items || [];

      // Apply filters
      if (filters.status && filters.status !== "all") {
        filteredResults = filteredResults.filter(company => 
          company.company_status.toLowerCase() === filters.status.toLowerCase()
        );
      }

      if (filters.type && filters.type !== "all") {
        filteredResults = filteredResults.filter(company => 
          company.company_type.toLowerCase().includes(filters.type.toLowerCase())
        );
      }

      // Apply sorting
      if (filters.sortBy === "name") {
        filteredResults.sort((a, b) => a.title.localeCompare(b.title));
      } else if (filters.sortBy === "date") {
        filteredResults.sort((a, b) => {
          const dateA = new Date(a.date_of_creation || 0);
          const dateB = new Date(b.date_of_creation || 0);
          return dateB.getTime() - dateA.getTime();
        });
      }

      setResults(filteredResults);
      setTotalResults(data.total_results || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchCompanies();
  };

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setTimeout(() => searchCompanies(), 100);
  };

  const toggleComparisonSelection = (company: CompanySearchResult) => {
    setSelectedForComparison(prev => {
      const exists = prev.find(c => c.company_number === company.company_number);
      if (exists) {
        return prev.filter(c => c.company_number !== company.company_number);
      } else if (prev.length < 3) {
        return [...prev, company];
      }
      return prev;
    });
  };

  const handleCompareSelected = () => {
    if (onCompareCompanies && selectedForComparison.length >= 2) {
      onCompareCompanies(selectedForComparison);
    }
  };

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

  const formatAddress = (address: CompanySearchResult['address']) => {
    if (!address) return 'No address available';
    
    const parts = [
      address.address_line_1,
      address.locality,
      address.postal_code
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Advanced Company Search
          </CardTitle>
          <CardDescription>
            Search, filter, and analyze UK companies with powerful tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter company name or number (e.g., 'Apple Inc' or '12345678')"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading || !query.trim()}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Search
                  </Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>
                  
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Company Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="dissolved">Dissolved</SelectItem>
                      <SelectItem value="liquidation">Liquidation</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Company Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="ltd">Private Limited</SelectItem>
                      <SelectItem value="plc">Public Limited</SelectItem>
                      <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="name">Company Name</SelectItem>
                      <SelectItem value="date">Date Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Recent Searches</span>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:bg-accent/50 transition-colors p-3"
                    onClick={() => handleRecentSearch(search)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{search}</span>
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Favorite Companies</span>
              </div>
              {favorites.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">No favorite companies yet</p>
                  <p className="text-sm text-gray-400 mt-1">Search and add companies to see them here</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {/* Favorites will be populated when feature is implemented */}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {totalResults > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Found {totalResults.toLocaleString()} results, showing {results.length}
          </div>
          <div className="flex items-center gap-4">
            {selectedForComparison.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedForComparison.length} selected
                </span>
                {onCompareCompanies && selectedForComparison.length >= 2 && (
                  <Button onClick={handleCompareSelected} size="sm" variant="outline">
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare ({selectedForComparison.length})
                  </Button>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-muted-foreground">
                Sorted by {filters.sortBy}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {results.map((company) => {
          const isSelected = selectedForComparison.find(c => c.company_number === company.company_number);
          return (
          <Card 
            key={company.company_number} 
            className={`cursor-pointer hover:bg-accent/50 transition-colors group ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {company.title}
                    </h3>
                    <Badge className={getStatusColor(company.company_status)}>
                      {company.company_status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p><strong>Company Number:</strong> {company.company_number}</p>
                      <p><strong>Type:</strong> {company.company_type}</p>
                    </div>
                    <div>
                      {company.date_of_creation && (
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <strong>Created:</strong> {new Date(company.date_of_creation).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div>
                      {company.address && (
                        <p className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{formatAddress(company.address)}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                      {company.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComparisonSelection(company);
                    }}
                    className={isSelected ? 'bg-blue-100 text-blue-700' : ''}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompanySelect(company);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );
}