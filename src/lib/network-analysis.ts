import { companiesHouseAPI, CompanyProfile } from './companies-house';

// =====================================================
// NETWORK ANALYSIS SERVICE
// Provides relationship mapping and network analysis
// =====================================================

export interface NetworkNode {
  id: string;
  type: 'company' | 'director' | 'shareholder' | 'address';
  label: string;
  data: any;
  
  // Visual properties
  size: number;
  color: string;
  riskLevel: 'low' | 'medium' | 'high';
  
  // Network metrics
  degree: number; // Number of connections
  betweenness: number; // Betweenness centrality
  clustering: number; // Clustering coefficient
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'directorship' | 'ownership' | 'address_shared' | 'subsidiary';
  label: string;
  
  // Relationship properties
  strength: number; // 0.0 to 1.0
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  
  // Visual properties
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  
  // Network-level metrics
  metrics: {
    totalNodes: number;
    totalEdges: number;
    density: number;
    avgDegree: number;
    maxDegree: number;
    connectedComponents: number;
    riskScore: number;
  };
  
  // Metadata
  centerEntity: {
    type: string;
    id: string;
    label: string;
  };
  depth: number;
  generatedAt: string;
  computeTime: number;
}

export interface DirectorshipNetwork {
  directorId: string;
  directorName: string;
  companies: Array<{
    companyNumber: string;
    companyName: string;
    role: string;
    appointedDate?: string;
    resignedDate?: string;
    isActive: boolean;
    riskFlags: string[];
  }>;
  
  // Cross-references with other directors
  coDirectors: Array<{
    directorId: string;
    directorName: string;
    sharedCompanies: string[];
    connectionStrength: number;
  }>;
  
  // Network metrics
  totalAppointments: number;
  activeAppointments: number;
  averageTenure: number;
  riskScore: number;
}

export interface OwnershipChain {
  targetCompany: string;
  chain: Array<{
    level: number;
    entityType: 'individual' | 'company' | 'trust';
    entityId: string;
    entityName: string;
    shareholding: number;
    votingRights: number;
    isBeneficial: boolean;
  }>;
  
  // Ultimate beneficial owners
  ultimateOwners: Array<{
    entityId: string;
    entityName: string;
    entityType: string;
    totalPercentage: number;
    controlType: 'voting' | 'ownership' | 'both';
  }>;
  
  // Ownership complexity metrics
  chainLength: number;
  ownershipConcentration: number; // Herfindahl index
  crossHoldings: boolean;
  circularOwnership: boolean;
}

export interface AddressClusterAnalysis {
  clusterId: string;
  clusterAddress: string;
  
  // Entities at this address
  companies: Array<{
    companyNumber: string;
    companyName: string;
    companyType: string;
    status: string;
    incorporationDate: string;
  }>;
  
  directors: Array<{
    directorId: string;
    directorName: string;
    activeAppointments: number;
    riskFlags: string[];
  }>;
  
  // Risk analysis
  riskIndicators: {
    highDirectorTurnover: boolean;
    dormantCompanies: number;
    recentIncorporations: number;
    sharedDirectors: number;
    suspiciousPatterns: string[];
  };
  
  clusterRiskScore: number;
}

export interface RiskNetwork {
  centerEntity: {
    type: string;
    id: string;
    name: string;
  };
  
  riskConnections: Array<{
    connectionType: 'director' | 'shareholder' | 'address' | 'corporate';
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    
    // Connected entity
    entityType: string;
    entityId: string;
    entityName: string;
    riskScore: number;
    
    // Relationship details
    relationshipType: string;
    relationshipStrength: number;
    isActive: boolean;
  }>;
  
  // Aggregate risk assessment
  overallRiskScore: number;
  riskCategory: 'low' | 'medium' | 'high' | 'critical';
  primaryRiskFactors: string[];
  recommendedActions: string[];
}

class NetworkAnalysisService {
  // =====================================================
  // CORE NETWORK ANALYSIS METHODS
  // =====================================================
  
  async generateCompanyNetwork(companyNumber: string, depth: number = 2): Promise<NetworkGraph> {
    const startTime = Date.now();
    const nodes: NetworkNode[] = [];
    const edges: NetworkEdge[] = [];
    
    try {
      // Start with the company as center node
      const companyProfile = await companiesHouseAPI.getCompanyProfile(companyNumber);
      const centerNode: NetworkNode = {
        id: `company_${companyNumber}`,
        type: 'company',
        label: companyProfile.company_name,
        data: companyProfile,
        size: 20,
        color: this.getCompanyColor(companyProfile.company_status),
        riskLevel: this.calculateCompanyRisk(companyProfile),
        degree: 0,
        betweenness: 0,
        clustering: 0
      };
      nodes.push(centerNode);
      
      // Get directors and their networks
      await this.expandDirectorNetwork(companyNumber, nodes, edges, depth);
      
      // Get ownership structure
      await this.expandOwnershipNetwork(companyNumber, nodes, edges, depth);
      
      // Calculate network metrics
      const metrics = this.calculateNetworkMetrics(nodes, edges);
      
      const computeTime = Date.now() - startTime;
      
      return {
        nodes,
        edges,
        metrics,
        centerEntity: {
          type: 'company',
          id: companyNumber,
          label: companyProfile.company_name
        },
        depth,
        generatedAt: new Date().toISOString(),
        computeTime
      };
      
    } catch (error) {
      console.error('Network generation error:', error);
      throw new Error('Failed to generate company network');
    }
  }
  
  async getDirectorshipNetwork(directorName: string): Promise<DirectorshipNetwork> {
    // This would query our database for director relationships
    // For now, returning mock structure - would be implemented with actual DB queries
    
    return {
      directorId: `director_${Date.now()}`,
      directorName,
      companies: [],
      coDirectors: [],
      totalAppointments: 0,
      activeAppointments: 0,
      averageTenure: 0,
      riskScore: 0
    };
  }
  
  async analyzeOwnershipChain(companyNumber: string): Promise<OwnershipChain> {
    // Implementation would trace ownership through our database
    
    return {
      targetCompany: companyNumber,
      chain: [],
      ultimateOwners: [],
      chainLength: 0,
      ownershipConcentration: 0,
      crossHoldings: false,
      circularOwnership: false
    };
  }
  
  async analyzeAddressCluster(address: string): Promise<AddressClusterAnalysis> {
    // Implementation would analyze address-based relationships
    
    return {
      clusterId: `cluster_${Date.now()}`,
      clusterAddress: address,
      companies: [],
      directors: [],
      riskIndicators: {
        highDirectorTurnover: false,
        dormantCompanies: 0,
        recentIncorporations: 0,
        sharedDirectors: 0,
        suspiciousPatterns: []
      },
      clusterRiskScore: 0
    };
  }
  
  async generateRiskNetwork(entityType: string, entityId: string): Promise<RiskNetwork> {
    // Implementation would analyze risk connections
    
    return {
      centerEntity: {
        type: entityType,
        id: entityId,
        name: 'Entity Name'
      },
      riskConnections: [],
      overallRiskScore: 0,
      riskCategory: 'low',
      primaryRiskFactors: [],
      recommendedActions: []
    };
  }
  
  // =====================================================
  // HELPER METHODS
  // =====================================================
  
  private async expandDirectorNetwork(
    companyNumber: string, 
    nodes: NetworkNode[], 
    edges: NetworkEdge[], 
    depth: number
  ): Promise<void> {
    if (depth <= 0) return;
    
    try {
      // Get officers data from Companies House
      const officers = await companiesHouseAPI.getCompanyOfficers(companyNumber);
      
      if (officers.items) {
        officers.items.forEach((officer: any) => {
          const directorNode: NetworkNode = {
            id: `director_${officer.name}_${companyNumber}`,
            type: 'director',
            label: officer.name,
            data: officer,
            size: 12,
            color: '#8B5CF6',
            riskLevel: this.calculateDirectorRisk(officer),
            degree: 0,
            betweenness: 0,
            clustering: 0
          };
          
          nodes.push(directorNode);
          
          // Add directorship edge
          const directorshipEdge: NetworkEdge = {
            id: `directorship_${officer.name}_${companyNumber}`,
            source: directorNode.id,
            target: `company_${companyNumber}`,
            type: 'directorship',
            label: officer.officer_role || 'Director',
            strength: 0.8,
            startDate: officer.appointed_on,
            endDate: officer.resigned_on,
            isActive: !officer.resigned_on,
            width: 2,
            color: '#8B5CF6',
            style: 'solid'
          };
          
          edges.push(directorshipEdge);
        });
      }
    } catch (error) {
      console.error('Director network expansion error:', error);
    }
  }
  
  private async expandOwnershipNetwork(
    companyNumber: string, 
    nodes: NetworkNode[], 
    edges: NetworkEdge[], 
    depth: number
  ): Promise<void> {
    if (depth <= 0) return;
    
    // Implementation would expand ownership relationships
    // This would involve querying PSC (People with Significant Control) data
  }
  
  private calculateNetworkMetrics(nodes: NetworkNode[], edges: NetworkEdge[]) {
    const totalNodes = nodes.length;
    const totalEdges = edges.length;
    const density = totalNodes > 1 ? (2 * totalEdges) / (totalNodes * (totalNodes - 1)) : 0;
    
    // Calculate degree for each node
    const degreeMap = new Map<string, number>();
    edges.forEach(edge => {
      degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
      degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
    });
    
    // Update node degrees
    nodes.forEach(node => {
      node.degree = degreeMap.get(node.id) || 0;
    });
    
    const degrees = Array.from(degreeMap.values());
    const avgDegree = degrees.length > 0 ? degrees.reduce((a, b) => a + b, 0) / degrees.length : 0;
    const maxDegree = degrees.length > 0 ? Math.max(...degrees) : 0;
    
    // Calculate risk score based on network structure
    let riskScore = 0;
    const highRiskNodes = nodes.filter(n => n.riskLevel === 'high').length;
    const inactiveEdges = edges.filter(e => !e.isActive).length;
    
    riskScore += (highRiskNodes / totalNodes) * 50;
    riskScore += (inactiveEdges / totalEdges) * 30;
    riskScore += (density > 0.7 ? 20 : 0); // High density can indicate unusual patterns
    
    return {
      totalNodes,
      totalEdges,
      density: Math.round(density * 100) / 100,
      avgDegree: Math.round(avgDegree * 100) / 100,
      maxDegree,
      connectedComponents: 1, // Simplified for now
      riskScore: Math.min(100, Math.round(riskScore))
    };
  }
  
  private getCompanyColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return '#10B981';
      case 'dissolved': return '#EF4444';
      case 'liquidation': return '#F59E0B';
      default: return '#6B7280';
    }
  }
  
  private calculateCompanyRisk(company: CompanyProfile): 'low' | 'medium' | 'high' {
    let riskFactors = 0;
    
    if (company.has_been_liquidated) riskFactors += 3;
    if (company.has_insolvency_history) riskFactors += 2;
    if (company.has_charges) riskFactors += 1;
    if (company.company_status !== 'active') riskFactors += 2;
    
    if (riskFactors >= 4) return 'high';
    if (riskFactors >= 2) return 'medium';
    return 'low';
  }
  
  private calculateDirectorRisk(officer: any): 'low' | 'medium' | 'high' {
    // Simplified risk calculation
    // Real implementation would consider multiple factors
    
    if (officer.resigned_on) return 'medium';
    if (officer.officer_role?.toLowerCase().includes('shadow')) return 'high';
    
    return 'low';
  }
  
  // =====================================================
  // CACHING AND PERFORMANCE
  // =====================================================
  
  async getCachedNetworkAnalysis(
    entityType: string, 
    entityId: string, 
    analysisType: string
  ): Promise<NetworkGraph | null> {
    // Implementation would check cache table and return cached results
    // if they exist and haven't expired
    return null;
  }
  
  async cacheNetworkAnalysis(
    entityType: string, 
    entityId: string, 
    analysisType: string, 
    result: NetworkGraph,
    expirationHours: number = 24
  ): Promise<void> {
    // Implementation would save results to cache table
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);
    
    // Save to networkAnalysisCache table
  }
}

export const networkAnalysisService = new NetworkAnalysisService();