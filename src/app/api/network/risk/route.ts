import { NextRequest, NextResponse } from 'next/server';
import { networkAnalysisService } from '@/lib/network-analysis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Entity type and ID are required' },
        { status: 400 }
      );
    }

    const riskNetwork = await networkAnalysisService.generateRiskNetwork(
      entityType,
      entityId
    );

    return NextResponse.json(riskNetwork);

  } catch (error) {
    console.error('Risk network analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze risk network',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}