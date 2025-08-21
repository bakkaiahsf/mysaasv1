import { NextRequest, NextResponse } from 'next/server';
import { CompanyProfile } from '@/lib/companies-house';

interface AIRiskAssessment {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  factors: string[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ companyNumber: string }> }
) {
  try {
    const { companyNumber } = await params;

    // Fetch company profile for risk analysis
    const companyResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/companies/${companyNumber}`);
    let companyProfile: CompanyProfile | null = null;
    
    if (companyResponse.ok) {
      companyProfile = await companyResponse.json();
    }

    // Fetch officers data for analysis
    const officersResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/companies/${companyNumber}/officers`);
    let officersData = null;
    
    if (officersResponse.ok) {
      officersData = await officersResponse.json();
    }

    // Generate AI risk assessment based on available data
    const riskAssessment = generateRiskAssessment(companyProfile, officersData);

    // TODO: In production, integrate with actual AI service (OpenAI, Claude, etc.)
    // For now, using intelligent rule-based assessment
    
    return NextResponse.json(riskAssessment);
  } catch (error) {
    console.error('Risk assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate risk assessment' },
      { status: 500 }
    );
  }
}

function generateRiskAssessment(
  profile: CompanyProfile | null, 
  officers: any
): AIRiskAssessment {
  let riskScore = 5; // Start with medium risk
  const factors: string[] = [];
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';

  if (!profile) {
    return {
      riskScore: 6,
      riskLevel: 'Medium',
      summary: "Limited company data available for comprehensive risk assessment.",
      factors: ["Insufficient data for full analysis"]
    };
  }

  // Company status assessment
  if (profile.company_status === 'active') {
    riskScore -= 1;
    factors.push("Active company status");
  } else if (profile.company_status === 'dissolved') {
    riskScore += 3;
    factors.push("Company is dissolved");
  }

  // Filing compliance assessment
  if (profile.accounts?.next_due) {
    const nextDue = new Date(profile.accounts.next_due);
    const now = new Date();
    if (nextDue < now) {
      riskScore += 2;
      factors.push("Accounts filing overdue");
    } else {
      factors.push("Accounts filings up to date");
      riskScore -= 0.5;
    }
  }

  if (profile.confirmation_statement?.next_due) {
    const nextDue = new Date(profile.confirmation_statement.next_due);
    const now = new Date();
    if (nextDue < now) {
      riskScore += 1;
      factors.push("Confirmation statement overdue");
    } else {
      factors.push("Confirmation statement current");
      riskScore -= 0.5;
    }
  }

  // Financial indicators
  if (profile.has_been_liquidated) {
    riskScore += 3;
    factors.push("Company has liquidation history");
  }

  if (profile.has_charges) {
    riskScore += 1;
    factors.push("Company has registered charges");
  } else {
    factors.push("No registered charges");
  }

  if (profile.has_insolvency_history) {
    riskScore += 2;
    factors.push("Insolvency history present");
  }

  // Company age assessment
  if (profile.date_of_creation) {
    const incorporationDate = new Date(profile.date_of_creation);
    const ageInYears = (Date.now() - incorporationDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    
    if (ageInYears > 5) {
      riskScore -= 1;
      factors.push("Established company (5+ years)");
    } else if (ageInYears < 1) {
      riskScore += 1;
      factors.push("Recently incorporated company");
    }
  }

  // Officers stability assessment
  if (officers?.items) {
    const activeOfficers = officers.items.filter((officer: any) => !officer.resigned_on);
    const resignedRecently = officers.items.filter((officer: any) => {
      if (!officer.resigned_on) return false;
      const resignedDate = new Date(officer.resigned_on);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return resignedDate > sixMonthsAgo;
    });

    if (activeOfficers.length >= 1) {
      factors.push("Stable management team");
      riskScore -= 0.5;
    }

    if (resignedRecently.length > 2) {
      factors.push("High officer turnover recently");
      riskScore += 1;
    }
  }

  // Normalize risk score
  riskScore = Math.max(1, Math.min(10, Math.round(riskScore)));

  // Determine risk level
  if (riskScore <= 3) {
    riskLevel = 'Low';
  } else if (riskScore <= 6) {
    riskLevel = 'Medium';
  } else if (riskScore <= 8) {
    riskLevel = 'High';
  } else {
    riskLevel = 'Critical';
  }

  // Generate summary
  let summary = "";
  switch (riskLevel) {
    case 'Low':
      summary = "This company demonstrates low risk characteristics with stable operations, compliant filing patterns, and good corporate governance indicators.";
      break;
    case 'Medium':
      summary = "This company shows moderate risk factors. Some areas require attention but overall maintains acceptable business practices.";
      break;
    case 'High':
      summary = "This company exhibits several risk factors that warrant careful consideration before engaging in business relationships.";
      break;
    case 'Critical':
      summary = "This company presents significant risk factors. Thorough due diligence is strongly recommended before any business engagement.";
      break;
  }

  return {
    riskScore,
    riskLevel,
    summary,
    factors: factors.slice(0, 6) // Limit to top 6 factors
  };
}