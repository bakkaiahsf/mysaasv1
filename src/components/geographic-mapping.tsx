"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Map, 
  MapPin, 
  Layers,
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Filter,
  Building2,
  Users,
  AlertTriangle,
  Eye,
  Loader2,
  Info
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddressPoint {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  entities: Array<{
    id: string;
    name: string;
    type: 'company' | 'director' | 'shareholder';
    riskScore: number;
  }>;
  clusterSize: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  registrations: number;
  businessType: string[];
  suspiciousIndicators: string[];
}

interface GeographicData {
  addressPoints: AddressPoint[];
  clusters: Array<{
    id: string;
    centerLatitude: number;
    centerLongitude: number;
    addresses: string[];
    entityCount: number;
    riskScore: number;
    description: string;
  }>;
  heatmapData: Array<{
    latitude: number;
    longitude: number;
    intensity: number;
    riskScore: number;
  }>;
  boundingBox: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  stats: {
    totalAddresses: number;
    highRiskAddresses: number;
    addressClusters: number;
    averageEntitiesPerAddress: number;
  };
}

interface GeographicMappingProps {
  entityType?: string;
  entityId?: string;
  region?: string;
  onAddressClick?: (address: AddressPoint) => void;
  className?: string;
}

export function GeographicMapping({ 
  entityType,
  entityId,
  region = "uk",
  onAddressClick,
  className = "" 
}: GeographicMappingProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<GeographicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressPoint | null>(null);
  const [viewMode, setViewMode] = useState<"markers" | "heatmap" | "clusters">("markers");
  const [filterRisk, setFilterRisk] = useState("all");
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    fetchGeographicData();
  }, [entityType, entityId, region]);

  useEffect(() => {
    if (geoData && svgRef.current) {
      renderMap();
    }
  }, [geoData, viewMode, filterRisk]);

  const fetchGeographicData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        region,
        ...(entityType && { entityType }),
        ...(entityId && { entityId })
      });

      const response = await fetch(`/api/network/geographic?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch geographic data');
      }

      const data: GeographicData = await response.json();
      setGeoData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAddresses = () => {
    if (!geoData) return [];
    
    return geoData.addressPoints.filter(address => 
      filterRisk === "all" || address.riskLevel === filterRisk
    );
  };

  const renderMap = () => {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    svg.attr("width", width).attr("height", height);

    // Create projection for UK/Europe
    const projection = d3.geoMercator()
      .center([-2, 54]) // Approximate center of UK
      .scale(3000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const mainGroup = svg.append("g")
      .attr("class", "map-container");

    // Create base map (simplified UK outline)
    // In a real implementation, you would load actual UK geographic data
    const ukOutline = {
      type: "Polygon",
      coordinates: [[
        [-8, 60.8], [2, 60.8], [2, 49.8], [-8, 49.8], [-8, 60.8]
      ]]
    };

    mainGroup.append("path")
      .datum(ukOutline as any)
      .attr("d", path)
      .attr("fill", "#f8fafc")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1);

    const filteredAddresses = getFilteredAddresses();

    if (viewMode === "heatmap") {
      renderHeatmap(mainGroup, projection, filteredAddresses);
    } else if (viewMode === "clusters") {
      renderClusters(mainGroup, projection, geoData.clusters);
    } else {
      renderMarkers(mainGroup, projection, filteredAddresses);
    }

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        mainGroup.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
  };

  const renderMarkers = (container: d3.Selection<SVGGElement, unknown, null, undefined>, projection: d3.GeoProjection, addresses: AddressPoint[]) => {
    const markers = container.selectAll(".address-marker")
      .data(addresses)
      .enter()
      .append("g")
      .attr("class", "address-marker")
      .attr("transform", d => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? `translate(${coords[0]},${coords[1]})` : "";
      })
      .style("cursor", "pointer");

    // Risk-based colors
    const riskColors = {
      low: "#10b981",
      medium: "#f59e0b", 
      high: "#f97316",
      critical: "#ef4444"
    };

    // Marker circles (size based on entity count)
    markers.append("circle")
      .attr("r", d => Math.min(3 + d.clusterSize * 2, 15))
      .attr("fill", d => riskColors[d.riskLevel])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("opacity", 0.8)
      .style("filter", d => d.riskLevel === "high" || d.riskLevel === "critical" 
        ? "drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))" : "none");

    // Risk indicator dots for high-risk addresses
    markers.filter(d => d.riskLevel === "high" || d.riskLevel === "critical")
      .append("circle")
      .attr("r", 3)
      .attr("cx", 8)
      .attr("cy", -8)
      .attr("fill", "#ef4444")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    // Entity count labels
    markers.filter(d => d.clusterSize > 1)
      .append("text")
      .text(d => d.clusterSize.toString())
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("fill", "white")
      .style("pointer-events", "none");

    // Interactions
    markers
      .on("mouseover", function(event, d) {
        d3.select(this).select("circle")
          .transition()
          .attr("r", d => Math.min(3 + d.clusterSize * 2, 15) + 3)
          .style("opacity", 1);

        showTooltip(event, d);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).select("circle")
          .transition()
          .attr("r", d => Math.min(3 + d.clusterSize * 2, 15))
          .style("opacity", 0.8);
        
        d3.selectAll(".geo-tooltip").remove();
      })
      .on("click", function(event, d) {
        event.stopPropagation();
        setSelectedAddress(d);
        if (onAddressClick) onAddressClick(d);
      });
  };

  const renderHeatmap = (container: d3.Selection<SVGGElement, unknown, null, undefined>, projection: d3.GeoProjection, addresses: AddressPoint[]) => {
    const heatmapPoints = addresses.map(d => ({
      x: projection([d.longitude, d.latitude])?.[0] || 0,
      y: projection([d.longitude, d.latitude])?.[1] || 0,
      intensity: d.riskScore / 100
    }));

    // Create heat map using a simplified approach
    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      .domain([0, 1]);

    const heatmap = container.selectAll(".heat-point")
      .data(heatmapPoints)
      .enter()
      .append("circle")
      .attr("class", "heat-point")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 20)
      .attr("fill", d => colorScale(d.intensity))
      .style("opacity", 0.6)
      .style("mix-blend-mode", "multiply");
  };

  const renderClusters = (container: d3.Selection<SVGGElement, unknown, null, undefined>, projection: d3.GeoProjection, clusters: GeographicData['clusters']) => {
    const clusterGroups = container.selectAll(".cluster-group")
      .data(clusters)
      .enter()
      .append("g")
      .attr("class", "cluster-group")
      .attr("transform", d => {
        const coords = projection([d.centerLongitude, d.centerLatitude]);
        return coords ? `translate(${coords[0]},${coords[1]})` : "";
      });

    // Cluster circles
    clusterGroups.append("circle")
      .attr("r", d => 10 + d.entityCount * 2)
      .attr("fill", "rgba(59, 130, 246, 0.3)")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

    // Cluster center markers
    clusterGroups.append("circle")
      .attr("r", 4)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Entity count labels
    clusterGroups.append("text")
      .text(d => d.entityCount.toString())
      .attr("text-anchor", "middle")
      .attr("dy", -8)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#3b82f6");
  };

  const showTooltip = (event: any, d: AddressPoint) => {
    const tooltip = d3.select("body").append("div")
      .attr("class", "geo-tooltip")
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
        <div class="font-semibold mb-2">📍 ${d.address}</div>
        <div class="text-xs mb-1">🏢 Entities: ${d.entities.length}</div>
        <div class="text-xs mb-1">📊 Risk Score: ${d.riskScore}/100</div>
        <div class="text-xs mb-1">🎯 Risk Level: ${d.riskLevel}</div>
        <div class="text-xs mb-2">🔢 Registrations: ${d.registrations}</div>
        ${d.suspiciousIndicators.length > 0 ? 
          `<div class="text-xs mb-1">⚠️ Indicators: ${d.suspiciousIndicators.join(', ')}</div>` : 
          ''
        }
        <div class="text-xs">🏷️ Types: ${d.businessType.join(', ')}</div>
      `);

    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
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
      link.download = `geographic-map-${Date.now()}.svg`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading geographic data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchGeographicData} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!geoData || geoData.addressPoints.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No geographic data available</p>
        </CardContent>
      </Card>
    );
  }

  const filteredAddresses = getFilteredAddresses();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Geographic Address Analysis
            </CardTitle>
            <CardDescription>
              Interactive mapping of address clusters and geographic risk patterns
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markers">Markers</SelectItem>
                <SelectItem value="heatmap">Heatmap</SelectItem>
                <SelectItem value="clusters">Clusters</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="critical">Critical Risk</SelectItem>
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
        {/* Geographic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {filteredAddresses.length}
            </div>
            <div className="text-sm text-blue-600">Addresses Shown</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {geoData.stats.highRiskAddresses}
            </div>
            <div className="text-sm text-red-600">High Risk</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {geoData.stats.addressClusters}
            </div>
            <div className="text-sm text-purple-600">Clusters</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {(zoomLevel * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-orange-600">Zoom Level</div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <svg ref={svgRef} className="w-full h-[600px]" />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Critical Risk</span>
          </div>
        </div>

        {/* Selected Address Details */}
        {selectedAddress && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="text-sm mt-1">{selectedAddress.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Risk Level:</span>
                    <Badge 
                      className="ml-2"
                      variant={
                        selectedAddress.riskLevel === "critical" ? "destructive" :
                        selectedAddress.riskLevel === "high" ? "destructive" :
                        selectedAddress.riskLevel === "medium" ? "secondary" : "outline"
                      }
                    >
                      {selectedAddress.riskLevel}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Risk Score:</span>
                    <span className="ml-2 font-bold">{selectedAddress.riskScore}/100</span>
                  </div>
                  <div>
                    <span className="font-medium">Entity Count:</span>
                    <span className="ml-2">{selectedAddress.entities.length}</span>
                  </div>
                  <div>
                    <span className="font-medium">Registrations:</span>
                    <span className="ml-2">{selectedAddress.registrations}</span>
                  </div>
                </div>

                {selectedAddress.suspiciousIndicators.length > 0 && (
                  <div>
                    <span className="font-medium">Suspicious Indicators:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedAddress.suspiciousIndicators.map((indicator, idx) => (
                        <Badge key={idx} variant="destructive" className="text-xs">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="font-medium">Registered Entities:</span>
                  <div className="mt-2 space-y-2">
                    {selectedAddress.entities.slice(0, 5).map((entity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          {entity.type === 'company' ? 
                            <Building2 className="w-4 h-4" /> : 
                            <Users className="w-4 h-4" />
                          }
                          <span className="text-sm">{entity.name}</span>
                        </div>
                        <Badge variant="outline">
                          {entity.type}
                        </Badge>
                      </div>
                    ))}
                    {selectedAddress.entities.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{selectedAddress.entities.length - 5} more entities
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}