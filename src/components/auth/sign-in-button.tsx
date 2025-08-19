"use client";

import { useState } from "react";
import { signIn, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const { data: session, isPending } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isPending) {
    return <Button disabled>Loading...</Button>;
  }

  if (session) {
    return null;
  }

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setError(null);
      
      console.log("Starting Google sign-in process...");
      
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      
      console.log("Sign-in initiated successfully");
      
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2"
      >
        {isSigningIn ? "Signing in..." : "Sign in with Google"}
      </Button>
      {error && (
        <p className="text-sm text-red-600 max-w-sm text-center">
          {error}
        </p>
      )}
    </div>
  );
}
