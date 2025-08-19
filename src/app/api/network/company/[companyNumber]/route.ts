import { NextRequest, NextResponse } from 'next/server';
import { networkAnalysisService } from '@/lib/network-analysis';

export async function GET(
  request: NextRequest,
  { params }: { params: { companyNumber: string } }
) {
  try {
    const companyNumber = params.companyNumber;
    const { searchParams } = new URL(request.url);
    const depth = parseInt(searchParams.get('depth') || '2');
    const useCache = searchParams.get('cache') !== 'false';

    if (!companyNumber) {
      return NextResponse.json(
        { error: 'Company number is required' },
        { status: 400 }
      );
    }

    // Check cache first if enabled
    if (useCache) {
      const cached = await networkAnalysisService.getCachedNetworkAnalysis(
        'company',
        companyNumber,
        `network_depth_${depth}`
      );
      
      if (cached) {
        return NextResponse.json({
          ...cached,
          fromCache: true
        });
      }
    }

    // Generate new network analysis
    const networkGraph = await networkAnalysisService.generateCompanyNetwork(
      companyNumber,
      depth
    );

    // Cache the results
    if (useCache) {
      await networkAnalysisService.cacheNetworkAnalysis(
        'company',
        companyNumber,
        `network_depth_${depth}`,
        networkGraph,
        24 // Cache for 24 hours
      );
    }

    return NextResponse.json({
      ...networkGraph,
      fromCache: false
    });

  } catch (error) {
    console.error('Company network analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate company network analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}