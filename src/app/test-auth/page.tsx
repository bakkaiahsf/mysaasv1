"use client";

import { useSession, signIn, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function TestAuthPage() {
  const { data: session, isPending } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<string>("");

  useEffect(() => {
    const info = {
      session: session ? "✅ Session exists" : "❌ No session",
      isPending: isPending ? "⏳ Loading" : "✅ Ready",
      signInFunction: signIn ? "✅ signIn available" : "❌ signIn missing",
      signInSocial: signIn?.social ? "✅ signIn.social available" : "❌ signIn.social missing",
      currentURL: typeof window !== 'undefined' ? window.location.href : "server-side",
      timestamp: new Date().toISOString(),
    };
    setDebugInfo(info);
    console.log("Auth Test Debug:", info);
  }, [session, isPending]);

  const testDirectAuth = async () => {
    try {
      setTestResult("🧪 Testing direct auth...");
      const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
      const authURL = `${baseURL}/api/auth/signin/google?callbackUrl=${encodeURIComponent('/test-auth')}`;
      setTestResult(`🔗 Redirecting to: ${authURL}`);
      window.location.href = authURL;
    } catch (err) {
      setTestResult(`❌ Error: ${err}`);
    }
  };

  const testBetterAuth = async () => {
    try {
      setTestResult("🧪 Testing Better Auth...");
      console.log("Testing signIn.social...");
      
      if (!signIn?.social) {
        setTestResult("❌ signIn.social not available");
        return;
      }

      const result = await signIn.social({
        provider: "google",
        callbackURL: "/test-auth",
      });
      
      setTestResult(`✅ Better Auth result: ${JSON.stringify(result)}`);
    } catch (err) {
      setTestResult(`❌ Better Auth error: ${err}`);
      console.error("Better Auth error:", err);
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
        {isPending && <p>⏳ Loading session...</p>}
        {!isPending && !session && <p>❌ Not signed in</p>}
        {!isPending && session && (
          <div>
            <p>✅ Signed in as: {session.user?.name || session.user?.email}</p>
            <p>📧 Email: {session.user?.email}</p>
            <Button onClick={() => signOut()} className="mt-2">
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Test Buttons */}
      {!session && (
        <div className="space-y-4">
          <h2 className="font-semibold">🔧 Test Authentication Methods:</h2>
          
          <Button 
            onClick={testBetterAuth}
            className="mr-4 bg-blue-600 hover:bg-blue-700"
          >
            🧪 Test Better Auth
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