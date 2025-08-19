"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download,
  Settings,
  Info,
  Loader2
} from "lucide-react";
import { NetworkGraph, NetworkNode, NetworkEdge } from "@/lib/network-analysis";

interface NetworkGraphProps {
  companyNumber: string;
  onNodeClick?: (node: NetworkNode) => void;
  onEdgeClick?: (edge: NetworkEdge) => void;
  className?: string;
}

export function NetworkGraphVisualization({ 
  companyNumber, 
  onNodeClick, 
  onEdgeClick, 
  className = "" 
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [networkData, setNetworkData] = useState<NetworkGraph | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  // D3 simulation and visualization state
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkEdge> | null>(null);

  useEffect(() => {
    if (companyNumber) {
      fetchNetworkData();
    }
  }, [companyNumber]);

  useEffect(() => {
    if (networkData && svgRef.current) {
      renderNetwork();
    }
    
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [networkData]);

  const fetchNetworkData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/network/company/${companyNumber}?depth=2`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch network data');
      }

      const data: NetworkGraph = await response.json();
      setNetworkData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderNetwork = () => {
    if (!networkData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create main group for zooming and panning
    const mainGroup = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "main-group");

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        mainGroup.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation<NetworkNode>(networkData.nodes)
      .force("link", d3.forceLink<NetworkNode, NetworkEdge>(networkData.edges)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // Create arrow markers for directed edges
    const defs = svg.append("defs");
    
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Create edges/links
    const links = mainGroup.selectAll(".link")
      .data(networkData.edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", (d: NetworkEdge) => d.color)
      .attr("stroke-width", (d: NetworkEdge) => d.width)
      .attr("stroke-dasharray", (d: NetworkEdge) => 
        d.style === "dashed" ? "5,5" : d.style === "dotted" ? "2,2" : "none")
      .attr("marker-end", "url(#arrowhead)")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        if (onEdgeClick) onEdgeClick(d);
      })
      .on("mouseover", function(event, d) {
        // Add tooltip
        d3.select(this).attr("stroke-width", (d.width + 2));
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "network-tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "9999")
          .html(`
            <strong>${d.label}</strong><br/>
            Type: ${d.type}<br/>
            Strength: ${(d.strength * 100).toFixed(1)}%<br/>
            ${d.isActive ? "Active" : "Inactive"}
          `);

        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("stroke-width", d.width);
        d3.selectAll(".network-tooltip").remove();
      });

    // Create nodes
    const nodes = mainGroup.selectAll(".node")
      .data(networkData.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on("start", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add circles for nodes
    nodes.append("circle")
      .attr("r", (d: NetworkNode) => d.size)
      .attr("fill", (d: NetworkNode) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", (d: NetworkNode) => 
        d.riskLevel === "high" ? "drop-shadow(0 0 6px red)" : 
        d.riskLevel === "medium" ? "drop-shadow(0 0 4px orange)" : "none");

    // Add labels
    nodes.append("text")
      .text((d: NetworkNode) => d.label)
      .attr("dx", (d: NetworkNode) => d.size + 5)
      .attr("dy", 4)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("fill", "#374151")
      .style("pointer-events", "none");

    // Add risk indicators
    nodes.filter((d: NetworkNode) => d.riskLevel !== "low")
      .append("circle")
      .attr("r", 4)
      .attr("cx", (d: NetworkNode) => d.size - 5)
      .attr("cy", (d: NetworkNode) => -(d.size - 5))
      .attr("fill", (d: NetworkNode) => 
        d.riskLevel === "high" ? "#EF4444" : "#F59E0B")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    // Node interactions
    nodes
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        if (onNodeClick) onNodeClick(d);
      })
      .on("mouseover", function(event, d) {
        // Highlight connected edges
        links
          .style("opacity", (edge: NetworkEdge) => 
            edge.source === d.id || edge.target === d.id ? 1 : 0.3)
          .attr("stroke-width", (edge: NetworkEdge) => 
            edge.source === d.id || edge.target === d.id ? edge.width + 1 : edge.width);

        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "network-tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "9999")
          .html(`
            <strong>${d.label}</strong><br/>
            Type: ${d.type}<br/>
            Risk Level: ${d.riskLevel}<br/>
            Connections: ${d.degree}<br/>
            Centrality: ${d.betweenness.toFixed(3)}
          `);

        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        // Reset link opacity
        links.style("opacity", 1).attr("stroke-width", (d: NetworkEdge) => d.width);
        d3.selectAll(".network-tooltip").remove();
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      links
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodes
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
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
      link.download = `network-${companyNumber}.svg`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Generating network visualization...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchNetworkData} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Company Network Analysis
            </CardTitle>
            <CardDescription>
              Interactive visualization of business relationships and connections
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
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
      
      <CardContent>
        {networkData && (
          <div className="space-y-4">
            {/* Network Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {networkData.metrics.totalNodes}
                </div>
                <div className="text-sm text-blue-600">Entities</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {networkData.metrics.totalEdges}
                </div>
                <div className="text-sm text-purple-600">Connections</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(networkData.metrics.density * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-green-600">Density</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {networkData.metrics.riskScore}
                </div>
                <div className="text-sm text-orange-600">Risk Score</div>
              </div>
            </div>

            {/* Zoom Level Indicator */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">
                Zoom: {(zoomLevel * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {networkData.depth} degrees of separation
              </div>
            </div>

            {/* SVG Network Visualization */}
            <div className="border rounded-lg overflow-hidden bg-white">
              <svg ref={svgRef} className="w-full h-[600px]" />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span>Directors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>Shareholders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-px bg-gray-400" style={{ width: "20px" }}></div>
                <span>Active Relationship</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-px bg-gray-400" style={{ width: "20px", borderStyle: "dashed" }}></div>
                <span>Inactive Relationship</span>
              </div>
            </div>

            {/* Selected Node Info */}
            {selectedNode && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Selected: {selectedNode.label}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {selectedNode.type}
                  </div>
                  <div>
                    <span className="font-medium">Risk Level:</span> 
                    <Badge 
                      variant={selectedNode.riskLevel === "high" ? "destructive" : 
                              selectedNode.riskLevel === "medium" ? "secondary" : "outline"}
                      className="ml-2"
                    >
                      {selectedNode.riskLevel}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Connections:</span> {selectedNode.degree}
                  </div>
                  <div>
                    <span className="font-medium">Centrality:</span> {selectedNode.betweenness.toFixed(3)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}