"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/use-simple-auth";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, Download } from "lucide-react";

interface Filing {
  transaction_id: string;
  description: string;
  description_values?: Record<string, string>;
  category: string;
  subcategory?: string;
  date: string;
  action_date?: string;
  type: string;
  paper_filed?: boolean;
  links?: {
    document?: string;
    self?: string;
  };
}

interface FilingHistoryResponse {
  items: Filing[];
  total_results: number;
  filing_history_status?: string;
}

export default function CompanyFilingHistoryPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const params = useParams();
  const router = useRouter();
  const companyNumber = params?.companyNumber as string;
  
  const [filings, setFilings] = useState<Filing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !companyNumber) return;

    const fetchFilings = async () => {
      try {
        const response = await fetch(`/api/companies/${companyNumber}/filing-history`);
        const data: FilingHistoryResponse = await response.json();
        
        if (response.ok) {
          setFilings(data.items || []);
        } else {
          setError('Failed to fetch filing history');
        }
      } catch (err) {
        setError('Error loading filing history');
      } finally {
        setLoading(false);
      }
    };

    fetchFilings();
  }, [companyNumber, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Please sign in to view filing history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading filing history...</p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'accounts': return 'bg-blue-100 text-blue-800';
      case 'annual-return': return 'bg-green-100 text-green-800';
      case 'confirmation-statement': return 'bg-green-100 text-green-800';
      case 'incorporation': return 'bg-purple-100 text-purple-800';
      case 'officers': return 'bg-orange-100 text-orange-800';
      case 'mortgage': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/company/${companyNumber}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-orange-600" />
            <h1 className="text-2xl font-bold">Compliance & Filings</h1>
          </div>
          <p className="text-gray-600">Company Number: {companyNumber}</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {filings.length > 0 ? filings.map((filing, index) => (
            <Card key={filing.transaction_id || index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getCategoryColor(filing.category)}>
                            {filing.category.replace(/-/g, ' ').toUpperCase()}
                          </Badge>
                          {filing.paper_filed && (
                            <Badge variant="outline" className="text-xs">Paper Filed</Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {filing.description}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Filed: {new Date(filing.date).toLocaleDateString('en-GB')}</span>
                          </div>
                          {filing.action_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Action: {new Date(filing.action_date).toLocaleDateString('en-GB')}</span>
                            </div>
                          )}
                        </div>
                        {filing.subcategory && (
                          <p className="text-xs text-gray-500 mt-1">
                            Type: {filing.subcategory.replace(/-/g, ' ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {filing.links?.document && (
                    <Button variant="outline" size="sm" className="ml-4">
                      <Download className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No filing history available</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}