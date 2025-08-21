import { NextResponse } from 'next/server';
import { CompaniesHouseAPI } from '@/lib/companies-house';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyNumber: string }> }
) {
  try {
    const { companyNumber } = await params;
    
    if (!companyNumber) {
      return NextResponse.json(
        { error: 'Company number is required' },
        { status: 400 }
      );
    }

    const companiesHouseAPI = new CompaniesHouseAPI();
    const filingHistory = await companiesHouseAPI.getCompanyFilingHistory(companyNumber);

    return NextResponse.json(filingHistory);
  } catch (error) {
    console.error('Error fetching company filing history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company filing history' },
      { status: 500 }
    );
  }
}