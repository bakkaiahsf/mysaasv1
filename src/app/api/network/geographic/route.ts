import { NextRequest, NextResponse } from 'next/server';
import { networkAnalysisService } from '@/lib/network-analysis';
import { db } from '@/lib/db';
import { 
  companyProfiles,
  directors, 
  directorAppointments, 
  addressClusters
} from '@/lib/schema';
import { eq, and, like, sql, desc, count } from 'drizzle-orm';

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

interface GeographicCluster {
  id: string;
  centerLatitude: number;
  centerLongitude: number;
  addresses: string[];
  entityCount: number;
  riskScore: number;
  description: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'uk';
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    console.log('Geographic analysis request:', { region, entityType, entityId });

    // Mock data for demonstration purposes
    // In a real implementation, this would analyze actual address data from the database
    const mockAddressPoints: AddressPoint[] = [
      {
        id: '1',
        address: '1 London Bridge Street, London SE1 9GF',
        latitude: 51.5074,
        longitude: -0.1278,
        entities: [
          { id: '1', name: 'Tech Solutions Ltd', type: 'company', riskScore: 25 },
          { id: '2', name: 'John Smith', type: 'director', riskScore: 15 }
        ],
        clusterSize: 2,
        riskLevel: 'low',
        riskScore: 20,
        registrations: 2,
        businessType: ['Technology', 'Consulting'],
        suspiciousIndicators: []
      },
      {
        id: '2',
        address: '10 Downing Street, Westminster, London SW1A 2AA',
        latitude: 51.5033,
        longitude: -0.1276,
        entities: [
          { id: '3', name: 'Political Services Ltd', type: 'company', riskScore: 85 },
          { id: '4', name: 'Government Affairs Ltd', type: 'company', riskScore: 90 },
          { id: '5', name: 'Policy Group Ltd', type: 'company', riskScore: 75 }
        ],
        clusterSize: 3,
        riskLevel: 'high',
        riskScore: 83,
        registrations: 3,
        businessType: ['Government', 'Consulting', 'Politics'],
        suspiciousIndicators: ['Multiple companies', 'Government address', 'High activity']
      },
      {
        id: '3',
        address: 'Canary Wharf, London E14 5AB',
        latitude: 51.5054,
        longitude: -0.0235,
        entities: [
          { id: '6', name: 'Financial Holdings Ltd', type: 'company', riskScore: 45 },
          { id: '7', name: 'Investment Partners Ltd', type: 'company', riskScore: 55 },
          { id: '8', name: 'Banking Solutions Ltd', type: 'company', riskScore: 40 },
          { id: '9', name: 'Sarah Johnson', type: 'director', riskScore: 35 },
          { id: '10', name: 'Michael Brown', type: 'director', riskScore: 50 }
        ],
        clusterSize: 5,
        riskLevel: 'medium',
        riskScore: 45,
        registrations: 5,
        businessType: ['Financial Services', 'Investment', 'Banking'],
        suspiciousIndicators: ['Shared office space', 'Multiple financial entities']
      },
      {
        id: '4',
        address: '221B Baker Street, London NW1 6XE',
        latitude: 51.5238,
        longitude: -0.1585,
        entities: [
          { id: '11', name: 'Detective Services Ltd', type: 'company', riskScore: 15 },
          { id: '12', name: 'Sherlock Holmes', type: 'director', riskScore: 10 }
        ],
        clusterSize: 2,
        riskLevel: 'low',
        riskScore: 12,
        registrations: 2,
        businessType: ['Professional Services', 'Investigation'],
        suspiciousIndicators: []
      },
      {
        id: '5',
        address: 'Manchester Business Park, Manchester M40 5BG',
        latitude: 53.4808,
        longitude: -2.2426,
        entities: [
          { id: '13', name: 'Northern Industries Ltd', type: 'company', riskScore: 30 },
          { id: '14', name: 'Manufacturing Corp', type: 'company', riskScore: 25 },
          { id: '15', name: 'David Wilson', type: 'director', riskScore: 20 }
        ],
        clusterSize: 3,
        riskLevel: 'low',
        riskScore: 25,
        registrations: 3,
        businessType: ['Manufacturing', 'Industrial'],
        suspiciousIndicators: []
      },
      {
        id: '6',
        address: '1 Princes Street, Edinburgh EH2 2EQ',
        latitude: 55.9533,
        longitude: -3.1883,
        entities: [
          { id: '16', name: 'Scottish Holdings Ltd', type: 'company', riskScore: 60 },
          { id: '17', name: 'Highland Investments', type: 'company', riskScore: 70 },
          { id: '18', name: 'Energy Solutions Scotland', type: 'company', riskScore: 65 },
          { id: '19', name: 'Robert MacLeod', type: 'director', riskScore: 55 },
          { id: '20', name: 'Fiona Campbell', type: 'director', riskScore: 50 },
          { id: '21', name: 'James Stewart', type: 'director', riskScore: 60 }
        ],
        clusterSize: 6,
        riskLevel: 'medium',
        riskScore: 60,
        registrations: 6,
        businessType: ['Energy', 'Investment', 'Holdings'],
        suspiciousIndicators: ['Multiple related entities', 'Complex ownership', 'High director overlap']
      },
      {
        id: '7',
        address: 'Cardiff Bay, Cardiff CF10 4GA',
        latitude: 51.4816,
        longitude: -3.1791,
        entities: [
          { id: '22', name: 'Welsh Development Ltd', type: 'company', riskScore: 35 },
          { id: '23', name: 'Dragon Enterprises', type: 'company', riskScore: 40 }
        ],
        clusterSize: 2,
        riskLevel: 'low',
        riskScore: 37,
        registrations: 2,
        businessType: ['Development', 'Real Estate'],
        suspiciousIndicators: []
      },
      {
        id: '8',
        address: 'Offshore Financial Centre, Douglas, Isle of Man IM1 3LS',
        latitude: 54.1509,
        longitude: -4.4821,
        entities: [
          { id: '24', name: 'Offshore Holdings Ltd', type: 'company', riskScore: 95 },
          { id: '25', name: 'Tax Avoidance Solutions', type: 'company', riskScore: 98 },
          { id: '26', name: 'Shell Company 1', type: 'company', riskScore: 90 },
          { id: '27', name: 'Shell Company 2', type: 'company', riskScore: 92 },
          { id: '28', name: 'Nominee Director 1', type: 'director', riskScore: 85 },
          { id: '29', name: 'Nominee Director 2', type: 'director', riskScore: 88 }
        ],
        clusterSize: 6,
        riskLevel: 'critical',
        riskScore: 92,
        registrations: 6,
        businessType: ['Offshore Finance', 'Tax Planning', 'Shell Companies'],
        suspiciousIndicators: [
          'Offshore jurisdiction', 
          'Shell companies', 
          'Tax avoidance structure',
          'Nominee directors',
          'High risk profile'
        ]
      },
      {
        id: '9',
        address: 'Birmingham Business District, Birmingham B1 1AA',
        latitude: 52.4862,
        longitude: -1.8904,
        entities: [
          { id: '30', name: 'Midlands Manufacturing', type: 'company', riskScore: 20 },
          { id: '31', name: 'Central Services Ltd', type: 'company', riskScore: 25 },
          { id: '32', name: 'West Midlands Holdings', type: 'company', riskScore: 30 }
        ],
        clusterSize: 3,
        riskLevel: 'low',
        riskScore: 25,
        registrations: 3,
        businessType: ['Manufacturing', 'Services', 'Holdings'],
        suspiciousIndicators: []
      },
      {
        id: '10',
        address: 'Suspicious Address Block, London E20 1DY',
        latitude: 51.5462,
        longitude: -0.0158,
        entities: [
          { id: '33', name: 'Fake Company A', type: 'company', riskScore: 88 },
          { id: '34', name: 'Fake Company B', type: 'company', riskScore: 90 },
          { id: '35', name: 'Fake Company C', type: 'company', riskScore: 85 },
          { id: '36', name: 'Fake Company D', type: 'company', riskScore: 92 },
          { id: '37', name: 'Suspicious Director 1', type: 'director', riskScore: 95 },
          { id: '38', name: 'Suspicious Director 2', type: 'director', riskScore: 88 },
          { id: '39', name: 'Suspicious Director 3', type: 'director', riskScore: 90 }
        ],
        clusterSize: 7,
        riskLevel: 'critical',
        riskScore: 90,
        registrations: 7,
        businessType: ['Unknown', 'Shell Companies', 'Fronts'],
        suspiciousIndicators: [
          'Mass registration address',
          'High entity density',
          'Similar company names',
          'Rapid incorporation pattern',
          'No legitimate business activity',
          'AML red flags'
        ]
      }
    ];

    // Create clusters based on geographic proximity
    const clusters: GeographicCluster[] = [
      {
        id: 'london-financial',
        centerLatitude: 51.5074,
        centerLongitude: -0.1278,
        addresses: [
          '1 London Bridge Street, London SE1 9GF',
          'Canary Wharf, London E14 5AB',
          '10 Downing Street, Westminster, London SW1A 2AA'
        ],
        entityCount: 10,
        riskScore: 49,
        description: 'London Financial District Cluster'
      },
      {
        id: 'offshore-high-risk',
        centerLatitude: 54.1509,
        centerLongitude: -4.4821,
        addresses: [
          'Offshore Financial Centre, Douglas, Isle of Man IM1 3LS'
        ],
        entityCount: 6,
        riskScore: 92,
        description: 'Offshore High-Risk Cluster'
      },
      {
        id: 'suspicious-london',
        centerLatitude: 51.5462,
        centerLongitude: -0.0158,
        addresses: [
          'Suspicious Address Block, London E20 1DY'
        ],
        entityCount: 7,
        riskScore: 90,
        description: 'Mass Registration Suspicious Cluster'
      },
      {
        id: 'regional-centers',
        centerLatitude: 53.0,
        centerLongitude: -2.0,
        addresses: [
          'Manchester Business Park, Manchester M40 5BG',
          '1 Princes Street, Edinburgh EH2 2EQ',
          'Cardiff Bay, Cardiff CF10 4GA',
          'Birmingham Business District, Birmingham B1 1AA'
        ],
        entityCount: 13,
        riskScore: 37,
        description: 'Regional Business Centers Cluster'
      }
    ];

    // Create heatmap data
    const heatmapData = mockAddressPoints.map(point => ({
      latitude: point.latitude,
      longitude: point.longitude,
      intensity: point.riskScore / 100,
      riskScore: point.riskScore
    }));

    // Calculate bounding box
    const latitudes = mockAddressPoints.map(p => p.latitude);
    const longitudes = mockAddressPoints.map(p => p.longitude);
    
    const boundingBox = {
      north: Math.max(...latitudes) + 0.1,
      south: Math.min(...latitudes) - 0.1,
      east: Math.max(...longitudes) + 0.1,
      west: Math.min(...longitudes) - 0.1
    };

    // Calculate statistics
    const stats = {
      totalAddresses: mockAddressPoints.length,
      highRiskAddresses: mockAddressPoints.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length,
      addressClusters: clusters.length,
      averageEntitiesPerAddress: mockAddressPoints.reduce((sum, p) => sum + p.entities.length, 0) / mockAddressPoints.length
    };

    const geographicData = {
      addressPoints: mockAddressPoints,
      clusters,
      heatmapData,
      boundingBox,
      stats
    };

    return NextResponse.json(geographicData);

  } catch (error) {
    console.error('Geographic analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze geographic data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate geographic distance (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to analyze address clustering patterns
function analyzeAddressClustering(addresses: AddressPoint[]): {
  clusters: GeographicCluster[];
  suspiciousPatterns: string[];
} {
  const clusters: GeographicCluster[] = [];
  const suspiciousPatterns: string[] = [];
  
  // Group addresses by proximity (within 1km)
  const proximityGroups: AddressPoint[][] = [];
  const processed = new Set<string>();
  
  for (const address of addresses) {
    if (processed.has(address.id)) continue;
    
    const group = [address];
    processed.add(address.id);
    
    for (const otherAddress of addresses) {
      if (processed.has(otherAddress.id)) continue;
      
      const distance = calculateDistance(
        address.latitude, address.longitude,
        otherAddress.latitude, otherAddress.longitude
      );
      
      if (distance <= 1) { // Within 1km
        group.push(otherAddress);
        processed.add(otherAddress.id);
      }
    }
    
    if (group.length > 1) {
      proximityGroups.push(group);
    }
  }
  
  // Analyze each group for suspicious patterns
  for (let i = 0; i < proximityGroups.length; i++) {
    const group = proximityGroups[i];
    const totalEntities = group.reduce((sum, addr) => sum + addr.entities.length, 0);
    const avgRisk = group.reduce((sum, addr) => sum + addr.riskScore, 0) / group.length;
    
    // Calculate cluster center
    const centerLat = group.reduce((sum, addr) => sum + addr.latitude, 0) / group.length;
    const centerLon = group.reduce((sum, addr) => sum + addr.longitude, 0) / group.length;
    
    const cluster: GeographicCluster = {
      id: `cluster-${i}`,
      centerLatitude: centerLat,
      centerLongitude: centerLon,
      addresses: group.map(g => g.address),
      entityCount: totalEntities,
      riskScore: Math.round(avgRisk),
      description: `Geographic cluster with ${group.length} addresses and ${totalEntities} entities`
    };
    
    clusters.push(cluster);
    
    // Check for suspicious patterns
    if (totalEntities > 10 && group.length <= 2) {
      suspiciousPatterns.push(`High entity concentration at ${group[0].address}`);
    }
    
    if (avgRisk > 70) {
      suspiciousPatterns.push(`High risk cluster near ${group[0].address}`);
    }
    
    // Check for shell company patterns
    const shellCompanyCount = group.reduce((count, addr) => {
      return count + addr.entities.filter(e => 
        e.name.toLowerCase().includes('shell') || 
        e.name.toLowerCase().includes('nominee') ||
        e.riskScore > 80
      ).length;
    }, 0);
    
    if (shellCompanyCount > 2) {
      suspiciousPatterns.push(`Potential shell company cluster at ${group[0].address}`);
    }
  }
  
  return { clusters, suspiciousPatterns };
}