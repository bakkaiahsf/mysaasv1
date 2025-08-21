import { NextRequest, NextResponse } from 'next/server';
import { createSession, setSessionCookie } from '@/lib/simple-google-auth';

async function exchangeCodeForTokens(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  return response.json();
}

async function getUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  console.log('=== OAuth Callback Debug ===');
  console.log('Full URL:', request.url);
  
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  console.log('Parameters:', { 
    code: code ? 'present' : 'missing', 
    state, 
    error, 
    errorDescription 
  });

  // Handle OAuth error from Google
  if (error) {
    console.log('Google OAuth error:', error, errorDescription);
    return NextResponse.redirect(new URL(`/?error=google-${error}&description=${encodeURIComponent(errorDescription || '')}`, request.url));
  }

  if (!code) {
    console.log('No authorization code received');
    return NextResponse.redirect(new URL('/?error=no-code', request.url));
  }

  try {
    console.log('Exchanging code for tokens...');
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    console.log('Tokens received:', { access_token: 'present', token_type: tokens.token_type });
    
    console.log('Getting user info...');
    // Get user info
    const googleUser = await getUserInfo(tokens.access_token);
    console.log('User info received:', { email: googleUser.email, name: googleUser.name });
    
    // Create user object
    const user = {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    };

    console.log('Creating session...');
    // Create session
    const sessionToken = await createSession(user);
    console.log('Session created successfully');
    
    // Set cookie and redirect
    const redirectUrl = new URL(state, request.url);
    console.log('Redirecting to:', redirectUrl.toString());
    const response = NextResponse.redirect(redirectUrl);
    setSessionCookie(response, sessionToken);
    
    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL(`/?error=oauth-failed&message=${encodeURIComponent((error as Error).message)}`, request.url));
  }
}