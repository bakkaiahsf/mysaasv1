import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();
  console.log(`\n🚀 [${timestamp}] OAuth Signin Started`);
  console.log('📍 Request URL:', request.url);
  console.log('🌐 User-Agent:', request.headers.get('user-agent'));
  console.log('🔗 Referer:', request.headers.get('referer'));
  
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  console.log('📋 Callback URL requested:', callbackUrl);
  
  // Environment check
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  console.log('🔑 Client ID (first 10 chars):', clientId?.substring(0, 10) + '...');
  console.log('🏠 App URL:', appUrl);
  
  const redirectUri = `${appUrl}/api/auth/callback`;
  console.log('🎯 Full Redirect URI:', redirectUri);
  
  if (!clientId) {
    console.log('❌ ERROR: GOOGLE_CLIENT_ID is not set!');
    return NextResponse.json({ error: 'OAuth not configured' }, { status: 500 });
  }
  
  const googleAuthUrl = new URL('https://accounts.google.com/oauth/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'email profile');
  googleAuthUrl.searchParams.set('state', callbackUrl);
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  const finalGoogleUrl = googleAuthUrl.toString();
  console.log('🔗 Final Google OAuth URL:', finalGoogleUrl);
  console.log('✅ Redirecting to Google...\n');

  return NextResponse.redirect(finalGoogleUrl);
}