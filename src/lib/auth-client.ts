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

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient