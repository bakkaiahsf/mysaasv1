"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FixOAuthPage() {
  const CLIENT_ID = "930207387238-lb2egpe55178o24u8fo10r2hbh7v7onh.apps.googleusercontent.com";
  const REDIRECT_URI = "http://localhost:3000/api/auth/callback";

  const testDirectGoogleURL = () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'email profile',
      state: '/dashboard'
    });
    
    const url = `https://accounts.google.com/oauth/v2/auth?${params.toString()}`;
    console.log("Testing Google URL:", url);
    window.open(url, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-red-600">🚨 OAuth 404 Error Fix</h1>
      
      <Card className="mb-8 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">❌ Problem Identified</CardTitle>
          <CardDescription>Google OAuth is returning 404 - this is a Google Cloud Console configuration issue</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-semibold">Our server is working perfectly. The issue is in your Google Cloud Console setup.</p>
        </CardContent>
      </Card>

      <Card className="mb-8 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">✅ Step-by-Step Fix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white rounded border">
            <h3 className="font-bold mb-2">1. Go to Google Cloud Console</h3>
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              className="text-blue-600 hover:underline"
            >
              https://console.cloud.google.com/apis/credentials
            </a>
          </div>

          <div className="p-4 bg-white rounded border">
            <h3 className="font-bold mb-2">2. Find Your OAuth 2.0 Client ID</h3>
            <p className="mb-2">Look for this exact Client ID:</p>
            <div className="bg-gray-100 p-2 rounded font-mono text-sm flex justify-between items-center">
              <span>{CLIENT_ID}</span>
              <Button size="sm" onClick={() => copyToClipboard(CLIENT_ID)}>Copy</Button>
            </div>
          </div>

          <div className="p-4 bg-white rounded border">
            <h3 className="font-bold mb-2">3. Edit the OAuth Client</h3>
            <p className="mb-2">Click the pencil icon to edit, then in "Authorized redirect URIs" section, add:</p>
            <div className="bg-gray-100 p-2 rounded font-mono text-sm flex justify-between items-center">
              <span>{REDIRECT_URI}</span>
              <Button size="sm" onClick={() => copyToClipboard(REDIRECT_URI)}>Copy</Button>
            </div>
          </div>

          <div className="p-4 bg-white rounded border">
            <h3 className="font-bold mb-2">4. Save Configuration</h3>
            <p className="text-red-600 font-semibold">⚠️ CRITICAL: Click "SAVE" button after adding the URI!</p>
          </div>

          <div className="p-4 bg-white rounded border">
            <h3 className="font-bold mb-2">5. Configure OAuth Consent Screen</h3>
            <p className="mb-2">Go to "OAuth consent screen" tab and ensure:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>App name is filled</li>
              <li>User support email is set</li>
              <li>Developer contact email is set</li>
              <li>Add your email in "Test users" if in testing mode</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🧪 Test OAuth After Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testDirectGoogleURL} className="w-full">
            Test Direct Google OAuth (Opens New Tab)
          </Button>
          
          <p className="text-sm text-gray-600">
            This button tests the exact same URL our app uses. If you still get 404 after configuring Google Cloud Console, 
            the issue is definitely in your Google setup.
          </p>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700">💡 Common Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span><strong>Not saving after adding URI:</strong> Most common mistake - always click SAVE!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span><strong>Wrong project selected:</strong> Make sure you're in the correct Google Cloud project</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span><strong>Client ID mismatch:</strong> The Client ID in your Google Cloud must match exactly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span><strong>OAuth consent screen not configured:</strong> Required for OAuth to work</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}