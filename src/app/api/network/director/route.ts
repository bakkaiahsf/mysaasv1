import { NextRequest, NextResponse } from 'next/server';
import { networkAnalysisService } from '@/lib/network-analysis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const directorName = searchParams.get('name');

    if (!directorName) {
      return NextResponse.json(
        { error: 'Director name is required' },
        { status: 400 }
      );
    }

    const directorshipNetwork = await networkAnalysisService.getDirectorshipNetwork(
      directorName
    );

    return NextResponse.json(directorshipNetwork);

  } catch (error) {
    console.error('Director network analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze director network',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}