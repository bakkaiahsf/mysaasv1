"use client";

export default function SimpleTestPage() {
  const directGoogleTest = () => {
    // This is the EXACT same URL our server generates
    const url = "https://accounts.google.com/oauth/v2/auth?client_id=930207387238-lb2egpe55178o24u8fo10r2hbh7v7onh.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&response_type=code&scope=email+profile&state=%2Fdashboard&access_type=offline&prompt=consent";
    
    console.log("Testing URL:", url);
    window.location.href = url;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🔍 Simple OAuth Test</h1>
      <p className="mb-4">This tests the exact URL our server generates for Google OAuth.</p>
      <button 
        onClick={directGoogleTest}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Google OAuth Direct
      </button>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">What this test does:</h2>
        <ul className="list-disc ml-6">
          <li>Uses the EXACT same Google OAuth URL our server generates</li>
          <li>If you get 404 here, the problem is definitely in Google Cloud Console</li>
          <li>If this works, there might be a server-side issue</li>
        </ul>
      </div>
    </div>
  );
}