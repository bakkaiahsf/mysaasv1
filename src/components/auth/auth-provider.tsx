"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/lib/use-simple-auth";

interface AuthProviderProps {
  children: ReactNode;
}

function AuthDebug({ children }: { children: ReactNode }) {
  const { user, authenticated, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Debug information for development
    if (process.env.NODE_ENV === 'development') {
      setDebugInfo({
        baseURL: typeof window !== 'undefined' ? window.location.origin : 'server-side',
        session: user ? 'authenticated' : 'not authenticated',
        loading,
        authenticated,
        timestamp: new Date().toISOString(),
      });
      
      console.log('Auth Debug Info:', {
        baseURL: typeof window !== 'undefined' ? window.location.origin : 'server-side',
        session: user ? 'authenticated' : 'not authenticated',
        loading,
        authenticated,
      });
    }
  }, [user, loading, authenticated]);

  // Show debug info in development
  if (process.env.NODE_ENV === 'development' && debugInfo) {
    return (
      <>
        {children}
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs opacity-75">
          <div>Auth: {debugInfo.session}</div>
          <div>URL: {debugInfo.baseURL}</div>
          <div>Auth: {debugInfo.authenticated ? 'Yes' : 'No'}</div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthDebug>
      {children}
    </AuthDebug>
  );
}