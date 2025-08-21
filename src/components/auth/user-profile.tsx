"use client";

import { useAuth } from "@/lib/use-simple-auth";
import { SignInButton } from "./sign-in-button";
import { SignOutButton } from "./sign-out-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function UserProfile() {
  const { user, authenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated || !user) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <SignInButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        Welcome {user.name}
      </span>
      <Avatar className="size-8">
        <AvatarImage
          src={user.picture || ""}
          alt={user.name || "User"}
          referrerPolicy="no-referrer"
        />
        <AvatarFallback>
          {(
            user.name?.[0] ||
            user.email?.[0] ||
            "U"
          ).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <SignOutButton />
    </div>
  );
}
