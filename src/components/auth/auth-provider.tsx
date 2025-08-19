"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, isPending, error } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Debug information for development
    if (process.env.NODE_ENV === 'development') {
      setDebugInfo({
        baseURL: typeof window !== 'undefined' ? window.location.origin : 'server-side',
        session: session ? 'authenticated' : 'not authenticated',
        isPending,
        error: error?.message,
        timestamp: new Date().toISOString(),
      });
      
      console.log('Auth Debug Info:', {
        baseURL: typeof window !== 'undefined' ? window.location.origin : 'server-side',
        session: session ? 'authenticated' : 'not authenticated',
        isPending,
        error: error?.message,
      });
    }
  }, [session, isPending, error]);

  // Show debug info in development
  if (process.env.NODE_ENV === 'development' && debugInfo) {
    return (
      <>
        {children}
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs opacity-75">
          <div>Auth: {debugInfo.session}</div>
          <div>URL: {debugInfo.baseURL}</div>
          {debugInfo.error && <div className="text-red-300">Error: {debugInfo.error}</div>}
        </div>
      </>
    );
  }

  return <>{children}</>;
}