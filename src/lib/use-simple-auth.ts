"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthState {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    authenticated: false,
    loading: true,
  });

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          authenticated: data.authenticated,
          loading: false,
        });
      } else {
        setAuthState({
          user: null,
          authenticated: false,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setAuthState({
        user: null,
        authenticated: false,
        loading: false,
      });
    }
  };

  const signIn = (callbackUrl = '/dashboard') => {
    window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  const signOut = async (callbackUrl = '/') => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setAuthState({
        user: null,
        authenticated: false,
        loading: false,
      });
      
      window.location.href = callbackUrl;
    } catch (error) {
      console.error('Sign out failed:', error);
      // Force redirect even if API fails
      window.location.href = callbackUrl;
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return {
    ...authState,
    signIn,
    signOut,
    refreshSession: checkSession,
  };
}

// Compatibility wrapper for existing code
export function useSession() {
  const auth = useAuth();
  
  return {
    data: auth.user ? { user: auth.user } : null,
    isPending: auth.loading,
    isAuthenticated: auth.authenticated,
  };
}