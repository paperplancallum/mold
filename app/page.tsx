import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { CheckCircle, Camera, Sparkles, FileText, Clock, DollarSign } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoldScope - Instant AI-Powered Mold Analysis',
  description: 'Get professional-grade mold identification in under 60 seconds. Save $50-200 vs lab testing with AI-powered analysis and health recommendations.',
  openGraph: {
    title: 'MoldScope - Instant AI-Powered Mold Analysis',
    description: 'Get professional-grade mold identification in under 60 seconds. No lab required.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-16">
        <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  Instant AI-Powered Mold Analysis
                </h1>
                <p className="mt-6 text-xl text-gray-600">
                  Get professional-grade mold identification in under 60 seconds. No lab required.
                </p>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Results in under 60 seconds</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Save $50-200 vs lab testing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">AI-powered analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Health recommendations included</span>
                  </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md border-2 border-blue-600 px-8 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    Login
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative h-96 w-full rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-32 w-32 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Camera className="h-16 w-16 text-blue-600" />
                    </div>
                    <p className="text-blue-900 font-medium">Hero Image Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Get professional mold analysis in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Camera className="h-10 w-10 text-blue-600" />
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center justify-center rounded-full bg-blue-600 h-8 w-8 text-white font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Take or Upload Photo
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Capture a photo of your mold testing kit sample using your phone camera or upload an existing image.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Sparkles className="h-10 w-10 text-blue-600" />
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center justify-center rounded-full bg-blue-600 h-8 w-8 text-white font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Get Instant Analysis
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Our AI analyzes your sample in under 60 seconds, identifying mold types and assessing severity levels.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center justify-center rounded-full bg-blue-600 h-8 w-8 text-white font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Follow Recommendations
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Receive personalized health recommendations and actionable remediation guidance based on your results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 sm:py-32 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why Choose MoldScope?
              </h2>
            </div>

            <div className="mb-20">
              <div className="rounded-2xl bg-white p-8 shadow-lg max-w-3xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sample Analysis Result
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Our AI-powered analysis identifies mold species and provides detailed health risk assessments.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                        Moderate Risk
                      </span>
                      <span className="text-sm text-gray-500">Test #12345 • Bathroom Sample</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-20">
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">60s</div>
                <p className="text-gray-600">Average analysis time vs 7-14 days for traditional labs</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">$50-200</div>
                <p className="text-gray-600">Typical savings compared to professional lab analysis</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mb-4">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">AI</div>
                <p className="text-gray-600">Powered by advanced machine learning models</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-gray-700 italic mb-4">
                  "Saved me a trip to the expensive lab. Results were instant and easy to understand."
                </p>
                <p className="text-gray-900 font-semibold">— Sarah, Homeowner</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-gray-700 italic mb-4">
                  "Got peace of mind in under a minute. The health recommendations were really helpful."
                </p>
                <p className="text-gray-900 font-semibold">— Mike, Property Manager</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to analyze your mold sample?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of homeowners who trust MoldScope for fast, accurate results
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-base font-semibold text-blue-600 hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 MoldScope. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}