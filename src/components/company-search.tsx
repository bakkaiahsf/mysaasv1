"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, Loader2, Calendar, MapPin } from "lucide-react";
import { CompanySearchResult, SearchResponse } from "@/lib/companies-house";

interface CompanySearchProps {
  onCompanySelect: (company: CompanySearchResult) => void;
}

export function CompanySearch({ onCompanySelect }: CompanySearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
      setResults(data.items || []);
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
      address.address_line_2,
      address.locality,
      address.postal_code,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Company Search
          </CardTitle>
          <CardDescription>
            Search for companies by name or registration number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
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
          </form>
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
        <div className="text-sm text-muted-foreground">
          Found {totalResults.toLocaleString()} results
        </div>
      )}

      <div className="space-y-4">
        {results.map((company) => (
          <Card 
            key={company.company_number} 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onCompanySelect(company)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-lg">{company.title}</h3>
                    <Badge className={getStatusColor(company.company_status)}>
                      {company.company_status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
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
                  </div>

                  {company.address && (
                    <div className="flex items-start gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{formatAddress(company.address)}</span>
                    </div>
                  )}

                  {company.description && (
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="ml-4">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}