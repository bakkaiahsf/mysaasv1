import { NextRequest, NextResponse } from 'next/server';
import { getSession, getSessionFromRequest, deleteSession, clearSessionCookie } from '@/lib/simple-google-auth';

export async function GET(request: NextRequest) {
  const sessionToken = getSessionFromRequest(request);
  
  if (!sessionToken) {
    return NextResponse.json({ user: null, authenticated: false });
  }

  const session = await getSession(sessionToken);
  
  if (!session) {
    return NextResponse.json({ user: null, authenticated: false });
  }

  return NextResponse.json({ 
    user: session.user, 
    authenticated: true,
    expires: session.expires 
  });
}

export async function DELETE(request: NextRequest) {
  const sessionToken = getSessionFromRequest(request);
  
  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  
  return response;
}