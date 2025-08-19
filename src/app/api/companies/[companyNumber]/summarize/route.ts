import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { companiesHouseAPI, CompanyProfile } from '@/lib/companies-house';

export async function POST(
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

    // Get company profile data
    const companyProfile: CompanyProfile = await companiesHouseAPI.getCompanyProfile(companyNumber);
    
    // Get additional data
    const [officers, filingHistory] = await Promise.allSettled([
      companiesHouseAPI.getCompanyOfficers(companyNumber, 10),
      companiesHouseAPI.getCompanyFilingHistory(companyNumber, 10)
    ]);

    // Prepare data for AI analysis
    const companyData = {
      profile: companyProfile,
      officers: officers.status === 'fulfilled' ? officers.value : null,
      filingHistory: filingHistory.status === 'fulfilled' ? filingHistory.value : null
    };

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Generate AI summary
    const { text } = await generateText({
      model: openai(model),
      prompt: `
        Analyze the following company data from Companies House and provide a comprehensive business summary:

        Company Profile:
        ${JSON.stringify(companyProfile, null, 2)}

        Officers Data:
        ${officers.status === 'fulfilled' ? JSON.stringify(officers.value, null, 2) : 'Not available'}

        Filing History:
        ${filingHistory.status === 'fulfilled' ? JSON.stringify(filingHistory.value, null, 2) : 'Not available'}

        Please provide a detailed analysis including:
        1. Company Overview (name, type, status, incorporation date)
        2. Business Activity (SIC codes interpretation)
        3. Corporate Structure (registered office, key personnel)
        4. Compliance Status (filing history, due dates)
        5. Financial Health Indicators (based on available data)
        6. Risk Assessment (any red flags or concerns)
        7. Key Insights and Business Intelligence

        Format the response as a well-structured analysis with clear sections and bullet points where appropriate.
        Focus on actionable insights that would be valuable for business decision-making.
      `,
    });

    return NextResponse.json({
      summary: text,
      companyNumber,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI summarization error:', error);
    return NextResponse.json(
      { error: 'Failed to generate company summary' },
      { status: 500 }
    );
  }
}