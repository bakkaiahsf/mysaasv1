"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/use-simple-auth";
import { UserProfile } from "@/components/auth/user-profile";
import { 
  Building2, 
  Shield, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  BarChart3
} from "lucide-react";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Building2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="flex-1">
      {/* Hero Section - Search First */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Logo and Title */}
            <div className="space-y-6">
              <div className="flex justify-center items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center rounded-lg shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Smart KYB for UK Business</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Accelerate compliance and fuel growth with intelligent business verification. 
                <span className="text-blue-600 font-semibold"> Get instant KYB reports</span> powered by AI risk insights.
              </p>
            </div>
            
            {/* Main CTA */}
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!session?.user ? (
                  <>
                    <UserProfile />
                    <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-blue-200 text-blue-600 hover:bg-blue-50">
                      View Demo Report
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">Welcome back, {session?.user.name || session?.user.email || 'User'}!</p>
                    <Button 
                      onClick={() => window.location.href = '/search'}
                      size="lg" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    >
                      Start Company Search
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>

              {!session?.user && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">Trusted by professionals in banking, fintech, and compliance</p>
                  <div className="flex justify-center items-center gap-8 text-xs text-gray-400">
                    <span>🔒 Enterprise Security</span>
                    <span>📊 Live Data</span>
                    <span>🤖 AI-Powered</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive KYB Solutions for Modern Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From due diligence to risk assessment, we provide everything you need to make 
              confident business decisions with complete regulatory compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Business Intelligence</h3>
              <p className="text-gray-600 leading-relaxed">
                Deep company insights with real-time data from Companies House. 
                Get comprehensive business profiles, financial health indicators, and operational metrics.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Ownership Mapping</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete visibility into company ownership structures, director networks, and 
                beneficial ownership changes. Perfect for compliance and due diligence teams.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">AI Risk Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI algorithms analyze multiple data points to provide intelligent risk scores 
                and recommendations, helping you make faster, more informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600">
                Built for professionals who demand accuracy, speed, and compliance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Enterprise Security</h3>
                    <p className="text-sm text-gray-600">Bank-grade data protection</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">SOC 2 Type II Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">End-to-end encryption</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Regulatory Ready</h3>
                    <p className="text-sm text-gray-600">Built for compliance teams</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">AML/KYC Standards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Audit trails & reporting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Export-ready reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      {!session && (
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-6">Ready to Transform Your KYB Process?</h3>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of compliance professionals who trust our platform for faster, 
                smarter business verification and risk assessment.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white mb-2">5.2M+</div>
                    <div className="text-blue-100 text-sm">UK Companies Covered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-blue-100 text-sm">Data Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-2">&lt; 3s</div>
                    <div className="text-blue-100 text-sm">Average Report Time</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <UserProfile />
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Request Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
