"use client";

import { Button } from "@/components/ui/button";

export default function TestSigninPage() {
  const handleManualSignin = () => {
    const url = `/api/auth/signin?callbackUrl=${encodeURIComponent('/dashboard')}`;
    console.log('Signin URL:', url);
    window.location.href = url;
  };

  const handleDirectGoogle = () => {
    const googleUrl = new URL('https://accounts.google.com/oauth/v2/auth');
    googleUrl.searchParams.set('client_id', '930207387238-lb2egpe55178o24u8fo10r2hbh7v7onh.apps.googleusercontent.com');
    googleUrl.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/callback');
    googleUrl.searchParams.set('response_type', 'code');
    googleUrl.searchParams.set('scope', 'email profile');
    googleUrl.searchParams.set('state', '/dashboard');
    
    console.log('Direct Google URL:', googleUrl.toString());
    window.location.href = googleUrl.toString();
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-4 max-w-md">
        <div>
          <h3 className="font-semibold mb-2">Test 1: Via our signin endpoint</h3>
          <Button onClick={handleManualSignin} className="w-full">
            Test /api/auth/signin
          </Button>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Test 2: Direct Google OAuth</h3>
          <Button onClick={handleDirectGoogle} variant="outline" className="w-full">
            Test Direct Google OAuth
          </Button>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Current Session</h3>
          <Button 
            onClick={async () => {
              const response = await fetch('/api/auth/session');
              const data = await response.json();
              console.log('Session:', data);
              alert(JSON.stringify(data, null, 2));
            }} 
            variant="secondary" 
            className="w-full"
          >
            Check Session
          </Button>
        </div>
      </div>
    </div>
  );
}