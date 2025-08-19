"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Logo } from "@/components/logo";
import { 
  Search, 
  Sparkles, 
  Shield, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Star,
  Clock
} from "lucide-react";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Logo size="lg" className="justify-center mb-8" />
            <h1 className="text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              UK Company Intelligence
              <br />
              <span className="text-4xl">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Unlock the power of UK business intelligence with AI-driven insights. Research companies, 
              analyze competitors, and make informed decisions with comprehensive data from Companies House.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              {!session ? (
                <>
                  <UserProfile />
                  <p className="text-sm text-gray-500">Free to get started • No credit card required</p>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                    <Link href="/dashboard">
                      Start Exploring <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <p className="text-sm text-gray-500">Welcome back, {session.user.name}!</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for UK Business Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From startup research to competitor analysis, InsightUK provides the tools and data you need to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
              <Search className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Instant Company Search</h3>
              <p className="text-gray-600 mb-6">
                Search millions of UK companies by name or registration number. Get instant access to official Companies House data.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Real-time data updates</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Advanced search filters</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Export capabilities</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
              <Sparkles className="w-12 h-12 text-purple-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">AI-Powered Insights</h3>
              <p className="text-gray-600 mb-6">
                Transform raw company data into actionable intelligence with our advanced AI analysis and risk assessment.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Financial health analysis</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Risk assessment reports</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Competitive intelligence</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
              <Shield className="w-12 h-12 text-green-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Compliance Monitoring</h3>
              <p className="text-gray-600 mb-6">
                Stay on top of filing deadlines, compliance status, and regulatory changes for any UK company.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Filing history tracking</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Deadline notifications</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Compliance scoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Professionals Across Industries
            </h2>
            <p className="text-xl text-gray-600">
              See how InsightUK powers better business decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Investors & VCs</h3>
              <p className="text-gray-600 text-sm">Due diligence, portfolio monitoring, and investment research.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <Users className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sales Teams</h3>
              <p className="text-gray-600 text-sm">Lead qualification, prospect research, and competitive analysis.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <FileText className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Legal & Compliance</h3>
              <p className="text-gray-600 text-sm">Corporate verification, compliance monitoring, and legal research.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <Shield className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
              <p className="text-gray-600 text-sm">Credit assessment, fraud prevention, and supplier verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5M+</div>
              <div className="text-blue-100">UK Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">&lt;2s</div>
              <div className="text-blue-100">Search Speed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Unlock UK Business Intelligence?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of professionals who trust InsightUK for their company research needs.
            </p>
            
            {!session ? (
              <div className="space-y-4">
                <UserProfile />
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Free to start
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Instant access
                  </div>
                </div>
              </div>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                <Link href="/dashboard">
                  Access Your Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
