import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      message: "Auth test endpoint working",
      timestamp: new Date().toISOString(),
      env: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
        hasPostgresUrl: !!process.env.POSTGRES_URL,
      }
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
