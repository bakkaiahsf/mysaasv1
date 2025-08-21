"use client";

import { useState } from "react";
import { useAuth } from "@/lib/use-simple-auth";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const { user, authenticated, loading, signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (loading) {
    return <Button disabled>Loading...</Button>;
  }

  if (authenticated && user) {
    return null;
  }

  const handleSignIn = () => {
    setIsSigningIn(true);
    signIn("/search");
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg"
    >
      {isSigningIn ? "Signing in..." : "🚀 Sign in with Google"}
    </Button>
  );
}
