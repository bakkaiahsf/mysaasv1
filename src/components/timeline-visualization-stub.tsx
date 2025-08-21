"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineVisualizationProps {
  data?: any[];
  className?: string;
}

export function TimelineVisualization({ data = [], className }: TimelineVisualizationProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Timeline Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Timeline visualization temporarily disabled
          <br />
          {data.length} events to display
        </div>
      </CardContent>
    </Card>
  );
}