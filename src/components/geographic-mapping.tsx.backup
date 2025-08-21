"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GeographicMappingProps {
  companies?: any[];
  className?: string;
}

export function GeographicMapping({ companies = [], className }: GeographicMappingProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Geographic visualization temporarily disabled
          <br />
          Found {companies.length} companies for mapping
        </div>
      </CardContent>
    </Card>
  );
}