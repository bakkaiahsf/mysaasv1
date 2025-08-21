"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "@/lib/use-simple-auth";
import { UserProfile } from "@/components/auth/user-profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanySearchResult } from "@/lib/companies-house";
import { Lock, Search, Building2, ArrowLeft, MapPin, ArrowRight, Calendar } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function SearchContent() {
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Get initial query from URL params
  useEffect(() => {
    const q = searchParams?.get('q');
    if (q) {
      setSearchQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(searchTerm)}&items_per_page=20`);
      const data = await response.json();
      
      if (response.ok && data.items) {
        setSearchResults(data.items);
      } else {
        console.error('Search API error:', data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Building2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated || !session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-3xl font-bold mb-2">KYB Company Search</h1>
            <p className="text-lg text-gray-600 mb-6">
              Sign in to search UK companies and generate KYB reports
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Search Interface */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Advanced Company Search</h1>
            </div>
            <p className="text-gray-400 text-lg">Search, filter, and analyze UK companies with powerful tools</p>
          </div>

          {/* Search Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg max-w-md">
              <button className="flex-1 py-2 px-4 text-sm font-medium text-white bg-gray-700 rounded-md">
                Search
              </button>
            </div>
          </div>
          
          {/* Search Input and Button */}
          <div className="mb-8">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter company name or number (e.g., 'Apple Inc' or '12345678')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-lg py-4 px-4 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:bg-gray-700 rounded-lg"
              />
              <Button 
                onClick={() => handleSearch()}
                disabled={isLoading || !searchQuery.trim()}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 w-5 h-5" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Search Filters */}
          <div className="mb-8">
            <div className="bg-white p-4 rounded-lg flex items-center gap-4">
              <div className="flex items-center text-gray-600">
                <div className="w-5 h-5 mr-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 min-w-32">
                <option>All Statuses</option>
                <option>Active</option>
                <option>Dissolved</option>
              </select>
              
              <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 min-w-32">
                <option>All Types</option>
                <option>PLC</option>
                <option>LTD</option>
                <option>LLP</option>
              </select>
              
              <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 min-w-32">
                <option>Relevance</option>
                <option>Company Name A-Z</option>
                <option>Recently Incorporated</option>
              </select>
            </div>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-6">
              {searchResults.map((company) => (
                <div key={company.company_number} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-green-400" />
                          <h3 className="text-xl font-bold text-white">
                            {company.title}
                          </h3>
                          <Badge className={company.company_status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                            {company.company_status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                          <button className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </button>
                          <Button
                            onClick={() => router.push(`/dashboard?company=${company.company_number}`)}
                            className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                        <div>
                          <span className="text-gray-400">Company Number:</span> {company.company_number}
                        </div>
                        {company.date_of_creation && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400">Created:</span> {new Date(company.date_of_creation).toLocaleDateString('en-GB')}
                          </div>
                        )}
                        {company.address_snippet && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{company.address_snippet}</span>
                          </div>
                        )}
                      </div>

                      {company.company_type && (
                        <div className="mt-3">
                          <span className="text-gray-400">Type:</span> <span className="text-gray-300">{company.company_type}</span>
                        </div>
                      )}

                      {/* Additional info bar */}
                      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                        <div className="text-sm text-gray-300">
                          {company.company_number} - Incorporated on {company.date_of_creation ? new Date(company.date_of_creation).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }) : 'Unknown date'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasSearched && searchResults.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No companies found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search terms or check the spelling
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Search Tips */}
          {!hasSearched && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-white mb-4">Search Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <p className="font-medium mb-1 text-gray-200">Company Names:</p>
                  <p>Try "Tesco", "Apple UK", or partial matches</p>
                </div>
                <div>
                  <p className="font-medium mb-1 text-gray-200">Company Numbers:</p>
                  <p>Use 8-digit format: "00445790" or "SC123456"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Building2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}