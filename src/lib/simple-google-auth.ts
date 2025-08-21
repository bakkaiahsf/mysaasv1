import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface AuthSession {
  user: User;
  expires: string;
}

// Simple session storage (in production, use Redis or database)
const sessions = new Map<string, AuthSession>();

export function generateSessionToken(): string {
  return crypto.randomUUID();
}

export async function createSession(user: User): Promise<string> {
  const token = generateSessionToken();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7 days

  sessions.set(token, {
    user,
    expires: expires.toISOString(),
  });

  return token;
}

export async function getSession(token: string): Promise<AuthSession | null> {
  const session = sessions.get(token);
  if (!session) return null;

  // Check if expired
  if (new Date() > new Date(session.expires)) {
    sessions.delete(token);
    return null;
  }

  return session;
}

export async function deleteSession(token: string): Promise<void> {
  sessions.delete(token);
}

export function getSessionFromRequest(request: NextRequest): string | null {
  const cookieStore = request.cookies;
  return cookieStore.get('auth-token')?.value || null;
}

export function setSessionCookie(response: NextResponse, token: string): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/',
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete('auth-token');
}