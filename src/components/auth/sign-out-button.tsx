"use client";

import { useAuth } from "@/lib/use-simple-auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const { user, authenticated, loading, signOut } = useAuth();

  if (loading) {
    return <Button disabled>Loading...</Button>;
  }

  if (!authenticated || !user) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={() => signOut("/")}
    >
      Sign out
    </Button>
  );
}
