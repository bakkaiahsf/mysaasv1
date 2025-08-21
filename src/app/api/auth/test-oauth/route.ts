import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "OAuth Test Endpoint",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback`,
    googleClientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
    instructions: [
      "1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials",
      "2. Find your OAuth 2.0 Client ID",
      "3. Add this redirect URI: http://localhost:3000/api/auth/callback",
      "4. Save the configuration"
    ]
  });
}