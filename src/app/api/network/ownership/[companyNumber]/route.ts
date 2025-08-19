import { NextRequest, NextResponse } from 'next/server';
import { networkAnalysisService } from '@/lib/network-analysis';

export async function GET(
  request: NextRequest,
  { params }: { params: { companyNumber: string } }
) {
  try {
    const companyNumber = params.companyNumber;

    if (!companyNumber) {
      return NextResponse.json(
        { error: 'Company number is required' },
        { status: 400 }
      );
    }

    const ownershipChain = await networkAnalysisService.analyzeOwnershipChain(
      companyNumber
    );

    return NextResponse.json(ownershipChain);

  } catch (error) {
    console.error('Ownership analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze ownership structure',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}