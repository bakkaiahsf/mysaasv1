"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/simple-auth";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Calendar, MapPin } from "lucide-react";

interface Officer {
  name: string;
  officer_role: string;
  appointed_on?: string;
  resigned_on?: string;
  address?: {
    address_line_1?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
  occupation?: string;
  nationality?: string;
  date_of_birth?: {
    month: number;
    year: number;
  };
}

interface OfficersResponse {
  items: Officer[];
  total_results: number;
}

export default function CompanyOfficersPage() {
  const { data: session, isAuthenticated } = useSession();
  const params = useParams();
  const router = useRouter();
  const companyNumber = params?.companyNumber as string;
  
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set loading to false immediately - don't auto-fetch data
    setLoading(false);
  }, [companyNumber, isAuthenticated]);

  const handleLoadOfficers = async () => {
    if (!isAuthenticated || !companyNumber) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/companies/${companyNumber}/officers`);
      const data: OfficersResponse = await response.json();
      
      if (response.ok) {
        setOfficers(data.items || []);
      } else {
        setError('Failed to fetch officers');
      }
    } catch (err) {
      setError('Error loading officers');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-2">Please sign in to view company officers</p>
          <p className="text-gray-600">You need to be authenticated to access this data</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading officers...</p>
      </div>
    );
  }

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
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Directors & Officers</h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Company Number: {companyNumber}</p>
            {session && (
              <div className="text-right text-sm">
                <p className="text-gray-500">Logged in as:</p>
                <p className="font-medium">{session.name} ({session.email})</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {officers.length === 0 && !error && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Officer Information</h3>
              <p className="text-gray-600 mb-4">Click the button below to load director and officer information for this company.</p>
              <Button 
                onClick={handleLoadOfficers}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Loading..." : "Load Officers Data"}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {officers.length > 0 ? officers.map((officer, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{officer.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{officer.officer_role}</Badge>
                      {officer.nationality && (
                        <Badge variant="secondary">{officer.nationality}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {officer.appointed_on && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span>Appointed: {new Date(officer.appointed_on).toLocaleDateString('en-GB')}</span>
                    </div>
                  )}
                  
                  {officer.resigned_on && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span>Resigned: {new Date(officer.resigned_on).toLocaleDateString('en-GB')}</span>
                    </div>
                  )}
                  
                  {officer.occupation && (
                    <div>
                      <span className="text-gray-500">Occupation:</span> {officer.occupation}
                    </div>
                  )}
                  
                  {officer.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="text-gray-600">
                        {officer.address.address_line_1}
                        {officer.address.locality && `, ${officer.address.locality}`}
                        {officer.address.postal_code && ` ${officer.address.postal_code}`}
                        {officer.address.country && `, ${officer.address.country}`}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No officer information available</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}