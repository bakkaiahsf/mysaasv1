import { NextRequest, NextResponse } from 'next/server';
import { companiesHouseAPI } from '@/lib/companies-house';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const itemsPerPage = parseInt(searchParams.get('items_per_page') || '20');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const results = await companiesHouseAPI.searchCompanies(query, itemsPerPage);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Company search error:', error);
    return NextResponse.json(
      { error: 'Failed to search companies' },
      { status: 500 }
    );
  }
}