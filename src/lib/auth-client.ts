import { createAuthClient } from "better-auth/react"

// Get the base URL from environment or detect from browser
function getBaseURL() {
  // In browser, use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // In server-side, use environment variable or default
  return process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000";
}

console.log("Auth client initializing with baseURL:", getBaseURL());

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    onError: (context) => {
      console.error("Auth client error:", context);
    },
    onRequest: (context) => {
      console.log("Auth client request:", context.url);
    },
    onSuccess: (context) => {
      console.log("Auth client success:", context.url);
    },
  },
});

// Log the exported functions to verify they exist
console.log("Auth client exports:", {
  signIn: typeof authClient.signIn,
  signOut: typeof authClient.signOut,
  useSession: typeof authClient.useSession,
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient