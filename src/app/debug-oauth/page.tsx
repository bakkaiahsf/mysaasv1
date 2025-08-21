"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DebugOAuthPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testStep1 = async () => {
    addLog("🔍 Testing Step 1: Our signin endpoint");
    try {
      const response = await fetch('/api/auth/signin', { 
        method: 'GET',
        redirect: 'manual'
      });
      addLog(`✅ Signin endpoint status: ${response.status}`);
      addLog(`📍 Redirect location: ${response.headers.get('location')}`);
      
      if (response.status === 307 || response.status === 302) {
        const redirectUrl = response.headers.get('location');
        if (redirectUrl) {
          addLog(`🔗 Google OAuth URL: ${redirectUrl}`);
          return redirectUrl;
        }
      }
    } catch (error) {
      addLog(`❌ Error in Step 1: ${error}`);
    }
    return null;
  };

  const testStep2 = async (googleUrl: string) => {
    addLog("🔍 Testing Step 2: Google OAuth URL accessibility");
    try {
      // We can't actually test Google's OAuth endpoint from client-side due to CORS
      // But we can analyze the URL structure
      const url = new URL(googleUrl);
      addLog(`📋 OAuth Parameters:`);
      addLog(`   - client_id: ${url.searchParams.get('client_id')}`);
      addLog(`   - redirect_uri: ${url.searchParams.get('redirect_uri')}`);
      addLog(`   - response_type: ${url.searchParams.get('response_type')}`);
      addLog(`   - scope: ${url.searchParams.get('scope')}`);
      addLog(`   - state: ${url.searchParams.get('state')}`);
      
      addLog("⚠️  Now manually testing Google OAuth URL...");
      window.open(googleUrl, '_blank');
      
    } catch (error) {
      addLog(`❌ Error in Step 2: ${error}`);
    }
  };

  const testStep3 = async () => {
    addLog("🔍 Testing Step 3: Our callback endpoint");
    try {
      const testUrl = '/api/auth/callback?code=test_code&state=/dashboard';
      const response = await fetch(testUrl, { 
        method: 'GET',
        redirect: 'manual'
      });
      addLog(`✅ Callback endpoint status: ${response.status}`);
      addLog(`📍 Callback redirect: ${response.headers.get('location')}`);
    } catch (error) {
      addLog(`❌ Error in Step 3: ${error}`);
    }
  };

  const runFullTest = async () => {
    setLogs([]);
    addLog("🚀 Starting comprehensive OAuth debugging...");
    
    const googleUrl = await testStep1();
    if (googleUrl) {
      await testStep2(googleUrl);
    }
    await testStep3();
    
    addLog("✨ Debugging complete. Check the logs above.");
  };

  const testDirectGoogleAuth = () => {
    addLog("🔍 Testing Direct Google OAuth (will open in new tab)");
    const params = new URLSearchParams({
      client_id: '930207387238-lb2egpe55178o24u8fo10r2hbh7v7onh.apps.googleusercontent.com',
      redirect_uri: 'http://localhost:3000/api/auth/callback',
      response_type: 'code',
      scope: 'email profile',
      state: '/dashboard'
    });
    
    const googleUrl = `https://accounts.google.com/oauth/v2/auth?${params.toString()}`;
    addLog(`🔗 Direct Google URL: ${googleUrl}`);
    
    // Open in new tab so we can see if Google gives 404
    window.open(googleUrl, '_blank');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">OAuth Debugging Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Actions</h2>
          
          <Button onClick={runFullTest} className="w-full">
            🧪 Run Full OAuth Test
          </Button>
          
          <Button onClick={testDirectGoogleAuth} variant="outline" className="w-full">
            🔗 Test Direct Google OAuth
          </Button>
          
          <Button onClick={() => window.open('/api/auth/test-oauth', '_blank')} variant="secondary" className="w-full">
            ⚙️ Check OAuth Config
          </Button>
          
          <Button onClick={clearLogs} variant="destructive" className="w-full">
            🗑️ Clear Logs
          </Button>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Manual Tests</h2>
          
          <Button 
            onClick={() => window.location.href = '/api/auth/signin'} 
            className="w-full"
          >
            📱 Test Signin (Same Tab)
          </Button>
          
          <Button 
            onClick={() => window.open('/api/auth/signin', '_blank')} 
            variant="outline" 
            className="w-full"
          >
            🪟 Test Signin (New Tab)
          </Button>
          
          <Button 
            onClick={() => window.open('http://localhost:3000/api/auth/callback?error=test', '_blank')} 
            variant="secondary" 
            className="w-full"
          >
            🔄 Test Callback Endpoint
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Debug Logs</h2>
          <span className="text-sm text-gray-500">{logs.length} entries</span>
        </div>
        
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">No logs yet. Run a test to see detailed debugging information.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="font-mono text-sm p-2 bg-white dark:bg-gray-800 rounded border">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-8 p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">🔍 What we're debugging:</h3>
        <ul className="space-y-1 text-sm">
          <li>• Whether our signin endpoint works</li>
          <li>• If Google OAuth URL is properly formatted</li>
          <li>• Whether Google accepts our client_id and redirect_uri</li>
          <li>• If our callback endpoint is accessible</li>
          <li>• Where exactly the 404 error occurs</li>
        </ul>
      </div>
    </div>
  );
}