"use client";

import { useAuth } from "@/lib/use-simple-auth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function TestAuthPage() {
  const { user, authenticated, loading, signIn, signOut } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<string>("");

  useEffect(() => {
    const info = {
      session: authenticated ? "✅ Session exists" : "❌ No session",
      isPending: loading ? "⏳ Loading" : "✅ Ready",
      signInFunction: typeof signIn === 'function' ? "✅ signIn available" : "❌ signIn missing",
      user: user ? `✅ User: ${user.name}` : "❌ No user",
      currentURL: typeof window !== 'undefined' ? window.location.href : "server-side",
      timestamp: new Date().toISOString(),
    };
    setDebugInfo(info);
    console.log("Auth Test Debug:", info);
  }, [authenticated, loading, user]);

  const testDirectAuth = async () => {
    try {
      setTestResult("🧪 Testing direct auth...");
      const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
      const authURL = `${baseURL}/api/auth/signin?callbackUrl=${encodeURIComponent('/test-auth')}`;
      setTestResult(`🔗 Redirecting to: ${authURL}`);
      window.location.href = authURL;
    } catch (err) {
      setTestResult(`❌ Error: ${err}`);
    }
  };

  const testGoogleAuth = async () => {
    try {
      setTestResult("🧪 Testing Google OAuth...");
      signIn('/test-auth');
    } catch (err) {
      setTestResult(`❌ Google Auth error: ${err}`);
      console.error("Google Auth error:", err);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🧪 Authentication Test Page</h1>
      
      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">📊 Debug Information:</h2>
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      {/* Session Status */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">👤 Session Status:</h2>
        {loading && <p>⏳ Loading session...</p>}
        {!loading && !authenticated && <p>❌ Not signed in</p>}
        {!loading && authenticated && user && (
          <div>
            <p>✅ Signed in as: {user.name || user.email}</p>
            <p>📧 Email: {user.email}</p>
            <Button onClick={() => signOut()} className="mt-2">
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Test Buttons */}
      {!authenticated && (
        <div className="space-y-4">
          <h2 className="font-semibold">🔧 Test Authentication Methods:</h2>
          
          <Button 
            onClick={testGoogleAuth}
            className="mr-4 bg-blue-600 hover:bg-blue-700"
          >
            🧪 Test Google OAuth
          </Button>
          
          <Button 
            onClick={testDirectAuth}
            className="bg-green-600 hover:bg-green-700"
          >
            🔗 Test Direct Redirect
          </Button>
        </div>
      )}

      {/* Test Results */}
      {testResult && (
        <div className="bg-yellow-50 p-4 rounded-lg mt-6">
          <h2 className="font-semibold mb-2">🧪 Test Results:</h2>
          <p className="text-sm">{testResult}</p>
        </div>
      )}

      {/* Links */}
      <div className="mt-8 space-x-4">
        <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        <a href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</a>
      </div>
    </div>
  );
}