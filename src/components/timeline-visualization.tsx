"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Filter,
  Calendar,
  Users,
  FileText,
  Building2,
  TrendingUp,
  TrendingDown,
  Loader2,
  Info
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'appointment' | 'resignation' | 'filing' | 'shareholding' | 'address' | 'company_status' | 'other';
  title: string;
  description: string;
  entityName: string;
  entityType: 'person' | 'company' | 'filing';
  impact: 'high' | 'medium' | 'low';
  category: string;
  metadata: {
    [key: string]: any;
  };
}

interface TimelineData {
  events: TimelineEvent[];
  dateRange: {
    start: Date;
    end: Date;
  };
  stats: {
    totalEvents: number;
    eventsByType: { [key: string]: number };
    activeYears: number;
    significantEvents: number;
  };
}

interface TimelineVisualizationProps {
  entityType: string;
  entityId: string;
  timeRange?: { start: Date; end: Date };
  onEventClick?: (event: TimelineEvent) => void;
  className?: string;
}

export function TimelineVisualization({ 
  entityType, 
  entityId, 
  timeRange,
  onEventClick,
  className = "" 
}: TimelineVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("horizontal");
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (entityType && entityId) {
      fetchTimelineData();
    }
  }, [entityType, entityId, timeRange]);

  useEffect(() => {
    if (timelineData && svgRef.current) {
      renderTimeline();
    }
  }, [timelineData, filterType, viewMode]);

  const fetchTimelineData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        entityType,
        entityId,
        ...(timeRange && {
          startDate: timeRange.start.toISOString(),
          endDate: timeRange.end.toISOString()
        })
      });

      const response = await fetch(`/api/network/timeline?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }

      const data = await response.json();
      
      // Parse dates
      const parsedData: TimelineData = {
        ...data,
        events: data.events.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        })),
        dateRange: {
          start: new Date(data.dateRange.start),
          end: new Date(data.dateRange.end)
        }
      };
      
      setTimelineData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    if (!timelineData) return [];
    
    return timelineData.events.filter(event => 
      filterType === "all" || event.type === filterType
    );
  };

  const renderTimeline = () => {
    if (!timelineData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const filteredEvents = getFilteredEvents();
    if (filteredEvents.length === 0) return;

    const width = 800;
    const height = viewMode === "horizontal" ? 400 : 600;
    const margin = { top: 40, right: 40, bottom: 60, left: 40 };

    svg.attr("width", width).attr("height", height);

    const mainGroup = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const timeExtent = d3.extent(filteredEvents, d => d.date) as [Date, Date];
    
    let xScale: d3.ScaleTime<number, number>;
    let yScale: d3.ScalePoint<string> | d3.ScaleLinear<number, number>;

    if (viewMode === "horizontal") {
      xScale = d3.scaleTime()
        .domain(timeExtent)
        .range([0, innerWidth]);
        
      yScale = d3.scalePoint()
        .domain(['high', 'medium', 'low'])
        .range([50, innerHeight - 50])
        .padding(0.1);
    } else {
      xScale = d3.scaleTime()
        .domain(timeExtent)
        .range([innerHeight, 0]);
        
      yScale = d3.scaleLinear()
        .domain([0, filteredEvents.length])
        .range([0, innerWidth]);
    }

    // Create main timeline axis
    const timelineY = innerHeight / 2;
    
    if (viewMode === "horizontal") {
      // Horizontal timeline line
      mainGroup.append("line")
        .attr("x1", 0)
        .attr("y1", timelineY)
        .attr("x2", innerWidth)
        .attr("y2", timelineY)
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 3);

      // Time axis
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y-%m"));
        
      mainGroup.append("g")
        .attr("transform", `translate(0,${innerHeight - 20})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
    } else {
      // Vertical timeline line
      const timelineX = innerWidth / 2;
      mainGroup.append("line")
        .attr("x1", timelineX)
        .attr("y1", 0)
        .attr("x2", timelineX)
        .attr("y2", innerHeight)
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 3);

      // Time axis (vertical)
      const yAxis = d3.axisLeft(xScale)
        .tickFormat(d3.timeFormat("%Y-%m"));
        
      mainGroup.append("g")
        .attr("transform", `translate(20,0)`)
        .call(yAxis);
    }

    // Event type colors and icons
    const eventColors = {
      appointment: "#10b981", // green
      resignation: "#f59e0b", // amber
      filing: "#3b82f6", // blue
      shareholding: "#8b5cf6", // purple
      address: "#f97316", // orange
      company_status: "#ef4444", // red
      other: "#6b7280" // gray
    };

    const getEventIcon = (type: string) => {
      const icons = {
        appointment: "👤",
        resignation: "📤", 
        filing: "📄",
        shareholding: "📊",
        address: "🏠",
        company_status: "🏢",
        other: "•"
      };
      return icons[type as keyof typeof icons] || "•";
    };

    // Create event nodes
    const events = mainGroup.selectAll(".timeline-event")
      .data(filteredEvents)
      .enter()
      .append("g")
      .attr("class", "timeline-event")
      .style("cursor", "pointer");

    if (viewMode === "horizontal") {
      events.attr("transform", (d, i) => {
        const x = xScale(d.date);
        const baseY = timelineY;
        const offset = (i % 2 === 0 ? -1 : 1) * (60 + (i % 3) * 20);
        return `translate(${x},${baseY + offset})`;
      });

      // Connection lines
      events.append("line")
        .attr("x1", 0)
        .attr("y1", (d, i) => -(i % 2 === 0 ? -1 : 1) * (60 + (i % 3) * 20))
        .attr("x2", 0)
        .attr("y2", 0)
        .attr("stroke", "#d1d5db")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");
    } else {
      events.attr("transform", (d, i) => {
        const y = xScale(d.date);
        const baseX = innerWidth / 2;
        const offset = (i % 2 === 0 ? -1 : 1) * (80 + (i % 3) * 20);
        return `translate(${baseX + offset},${y})`;
      });

      // Connection lines
      events.append("line")
        .attr("x1", (d, i) => -(i % 2 === 0 ? -1 : 1) * (80 + (i % 3) * 20))
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 0)
        .attr("stroke", "#d1d5db")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");
    }

    // Event circles
    events.append("circle")
      .attr("r", d => d.impact === "high" ? 8 : d.impact === "medium" ? 6 : 4)
      .attr("fill", d => eventColors[d.type])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", d => d.impact === "high" ? "drop-shadow(0 0 6px rgba(0,0,0,0.3))" : "none");

    // Event labels
    events.append("text")
      .text(d => getEventIcon(d.type))
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // Event info boxes (on hover/click)
    events
      .on("mouseover", function(event, d) {
        // Highlight event
        d3.select(this).select("circle")
          .transition()
          .attr("r", d => (d.impact === "high" ? 8 : d.impact === "medium" ? 6 : 4) + 2)
          .attr("stroke-width", 3);

        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "timeline-tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.9)")
          .style("color", "white")
          .style("padding", "12px")
          .style("border-radius", "8px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "9999")
          .style("max-width", "300px")
          .html(`
            <div class="font-semibold mb-2">${d.title}</div>
            <div class="text-xs mb-1">📅 ${d3.timeFormat("%B %d, %Y")(d.date)}</div>
            <div class="text-xs mb-1">🏷️ ${d.type}</div>
            <div class="text-xs mb-1">👤 ${d.entityName}</div>
            <div class="text-xs mb-2">📈 Impact: ${d.impact}</div>
            <div class="text-xs">${d.description}</div>
          `);

        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        // Reset highlight
        d3.select(this).select("circle")
          .transition()
          .attr("r", d => d.impact === "high" ? 8 : d.impact === "medium" ? 6 : 4)
          .attr("stroke-width", 2);
        
        d3.selectAll(".timeline-tooltip").remove();
      })
      .on("click", function(event, d) {
        event.stopPropagation();
        setSelectedEvent(d);
        if (onEventClick) onEventClick(d);
      });

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        mainGroup.attr("transform", `translate(${margin.left},${margin.top}) ${event.transform}`);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
  };

  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
        1.5
      );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
        1 / 1.5
      );
    }
  };

  const handleReset = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
      );
      setZoomLevel(1);
    }
  };

  const handleExport = () => {
    if (svgRef.current) {
      const svgElement = svgRef.current;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `timeline-${entityId}.svg`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading timeline data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchTimelineData} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!timelineData || timelineData.events.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No timeline data available</p>
        </CardContent>
      </Card>
    );
  }

  const filteredEvents = getFilteredEvents();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historical Timeline
            </CardTitle>
            <CardDescription>
              Chronological analysis of key events and changes over time
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="resignation">Resignations</SelectItem>
                <SelectItem value="filing">Filings</SelectItem>
                <SelectItem value="shareholding">Shareholding</SelectItem>
                <SelectItem value="address">Address</SelectItem>
                <SelectItem value="company_status">Company Status</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {filteredEvents.length}
            </div>
            <div className="text-sm text-blue-600">Events Shown</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {timelineData.stats.activeYears}
            </div>
            <div className="text-sm text-green-600">Active Years</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {timelineData.stats.significantEvents}
            </div>
            <div className="text-sm text-purple-600">Significant Events</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {(zoomLevel * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-orange-600">Zoom Level</div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <svg ref={svgRef} className="w-full" />
        </div>

        {/* Event Type Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Appointments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span>Resignations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Filings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span>Shareholding</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>Address Changes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Company Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>Low Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>High Impact</span>
          </div>
        </div>

        {/* Selected Event Details */}
        {selectedEvent && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Event:</span>
                  <p className="text-sm mt-1">{selectedEvent.title}</p>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <p className="text-sm mt-1">
                    {d3.timeFormat("%B %d, %Y")(selectedEvent.date)}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Type:</span>
                  <Badge className="ml-2">{selectedEvent.type}</Badge>
                </div>
                <div>
                  <span className="font-medium">Impact:</span>
                  <Badge 
                    variant={
                      selectedEvent.impact === "high" ? "destructive" :
                      selectedEvent.impact === "medium" ? "secondary" : "outline"
                    }
                    className="ml-2"
                  >
                    {selectedEvent.impact}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Entity:</span>
                  <p className="text-sm mt-1">{selectedEvent.entityName}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Description:</span>
                  <p className="text-sm mt-1">{selectedEvent.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}