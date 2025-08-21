import { NextResponse } from 'next/server';

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

    // Companies House PSCs API endpoint
    const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
    if (!apiKey) {
      throw new Error('COMPANIES_HOUSE_API_KEY environment variable is required');
    }

    const url = `https://api.company-information.service.gov.uk/company/${companyNumber}/persons-with-significant-control`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Companies House API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching company PSCs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch persons with significant control' },
      { status: 500 }
    );
  }
}