"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const { data: session, isPending } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    // Debug information
    setDebugInfo(`Session: ${session ? 'Yes' : 'No'}, Pending: ${isPending}, URL: ${typeof window !== 'undefined' ? window.location.origin : 'server'}`);
    console.log("SignInButton Debug:", {
      session: !!session,
      isPending,
      signInFunction: typeof signIn?.social,
      baseURL: typeof window !== 'undefined' ? window.location.origin : 'server-side'
    });
  }, [session, isPending]);

  if (isPending) {
    return <Button disabled>Loading session...</Button>;
  }

  if (session) {
    return null;
  }

  // Fallback direct redirect method
  const handleDirectSignIn = () => {
    try {
      console.log("Direct redirect to Google OAuth...");
      const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
      const authURL = `${baseURL}/api/auth/signin/google?callbackUrl=${encodeURIComponent('/dashboard')}`;
      console.log("Redirecting to:", authURL);
      window.location.href = authURL;
    } catch (err) {
      console.error("Direct redirect failed:", err);
      setError("Redirect failed");
    }
  };

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setError(null);
      
      console.log("=== SIGN-IN DEBUG START ===");
      console.log("1. Button clicked");
      console.log("2. signIn object:", signIn);
      console.log("3. signIn.social function:", typeof signIn?.social);
      
      if (!signIn || typeof signIn.social !== 'function') {
        console.error("signIn.social is not available!");
        console.log("Falling back to direct redirect...");
        handleDirectSignIn();
        return;
      }
      
      console.log("4. Calling signIn.social...");
      
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      
      console.log("5. Sign-in result:", result);
      console.log("=== SIGN-IN DEBUG END ===");
      
    } catch (err) {
      console.error("=== SIGN-IN ERROR ===", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
      console.log("Trying direct redirect as fallback...");
      handleDirectSignIn();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg cursor-pointer"
        type="button"
      >
        {isSigningIn ? "Signing in..." : "🚀 Sign in with Google"}
      </Button>
      
      {/* Debug fallback button */}
      <Button
        onClick={handleDirectSignIn}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        Direct Sign-In (Debug)
      </Button>
      
      {error && (
        <p className="text-sm text-red-600 max-w-sm text-center">
          Error: {error}
        </p>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <p className="text-xs text-gray-500 max-w-sm text-center">
          Debug: {debugInfo}
        </p>
      )}
    </div>
  );
}
