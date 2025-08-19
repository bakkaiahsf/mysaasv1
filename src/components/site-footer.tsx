import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo size="md" className="mb-4" />
            <p className="text-sm text-muted-foreground max-w-md">
              InsightUK provides comprehensive UK company intelligence with AI-powered insights. 
              Make informed business decisions with real-time data from Companies House.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Company Search</a></li>
              <li><a href="#" className="hover:text-primary">AI Analysis</a></li>
              <li><a href="#" className="hover:text-primary">API Access</a></li>
              <li><a href="#" className="hover:text-primary">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">About</a></li>
              <li><a href="#" className="hover:text-primary">Privacy</a></li>
              <li><a href="#" className="hover:text-primary">Terms</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 InsightUK. All rights reserved. Powered by Companies House data.</p>
        </div>
      </div>
    </footer>
  );
}
