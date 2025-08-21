import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, deleteSession, clearSessionCookie } from '@/lib/simple-google-auth';

export async function POST(request: NextRequest) {
  const sessionToken = getSessionFromRequest(request);
  
  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  
  return response;
}