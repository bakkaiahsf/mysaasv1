import { NextRequest, NextResponse } from 'next/server';
import { networkAnalysisService } from '@/lib/network-analysis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    const addressCluster = await networkAnalysisService.analyzeAddressCluster(
      address
    );

    return NextResponse.json(addressCluster);

  } catch (error) {
    console.error('Address cluster analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze address cluster',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}