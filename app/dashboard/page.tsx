'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createBatchUrl, createTestUrl } from '@/lib/url-utils'
import Link from 'next/link'
import SeverityBadge from '@/components/SeverityBadge'
import OnboardingTutorial from '@/components/OnboardingTutorial'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [tests, setTests] = useState<any[]>([])
  const [readyTests, setReadyTests] = useState<any[]>([])
  const [currentBatch, setCurrentBatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const [testsRes, readyRes, batchRes] = await Promise.all([
        fetch('/api/tests?limit=5'),
        fetch('/api/tests?status=ready_for_review'),
        fetch('/api/batches/current'),
      ])

      if (testsRes.ok) {
        const data = await testsRes.json()
        setTests(data.tests || [])
      }

      if (readyRes.ok) {
        const data = await readyRes.json()
        setReadyTests(data.tests || [])
      }

      if (batchRes.ok) {
        const data = await batchRes.json()
        setCurrentBatch(data.batch)
      }

      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const handleSubmitBatch = async () => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/batches/submit', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to submit batch')
        return
      }

      const data = await response.json()
      const batchUrl = createBatchUrl({ display_id: data.display_id })
      router.push(batchUrl)
    } catch (error) {
      alert('Failed to submit batch. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <OnboardingTutorial />
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">MoldScope</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Link
                href="/account"
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to MoldScope. Start analyzing your mold samples.
          </p>
        </div>

        {readyTests.length > 0 && !currentBatch && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <svg className="hidden sm:block h-6 w-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-base sm:text-lg font-semibold text-blue-900">
                  Your Batch: {readyTests.length} {readyTests.length === 1 ? 'Test' : 'Tests'} Ready
                </h3>
              </div>
              
              <p className="text-sm leading-relaxed text-blue-700">
                {readyTests.length === 1 
                  ? 'This test will be reviewed by a lab technician.' 
                  : 'These tests will be reviewed together by a lab technician.'}
              </p>
              
              <p className="text-sm font-medium leading-relaxed text-blue-800">
                {readyTests.length === 1 
                  ? 'Upload more tests to add to this batch, or submit now.' 
                  : 'Upload more or submit this batch now.'}
              </p>
              
              <div className="space-y-2">
                {readyTests.slice(0, 4).map((test: any) => (
                  <div key={test.id} className="flex items-start gap-3 rounded-lg border border-blue-300 bg-white p-3">
                    {test.image ? (
                      <img
                        src={test.image.public_url}
                        alt={test.location}
                        className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-gray-100">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{test.location}</p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Exposed {test.duration}
                        </span>
                        {test.temperature && (
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            {test.temperature}°F
                          </span>
                        )}
                        {test.humidity && (
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            {test.humidity}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {readyTests.length > 4 && (
                  <div className="flex items-center justify-center rounded-lg border border-blue-300 bg-white p-3">
                    <span className="text-sm font-medium text-gray-700">+{readyTests.length - 4} more test{readyTests.length - 4 > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-blue-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Results in 48 hours after submission
              </p>
              
              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-start gap-3 rounded-lg border-2 border-blue-300 bg-white p-3 cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    I have uploaded all my tests and I'm ready to submit this batch for lab review
                  </span>
                </label>
                
                <button
                  onClick={handleSubmitBatch}
                  disabled={submitting || !confirmed}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </button>
                <Link
                  href="/tests/new"
                  className="w-full rounded-lg border-2 border-blue-600 bg-white px-4 py-3 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                  Add Another Test
                </Link>
              </div>
            </div>
          </div>
        )}

        {currentBatch && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900">
                  Batch In Review
                </h3>
                <p className="mt-1 text-sm text-amber-700">
                  Your batch of {currentBatch.tests?.length || 0} {currentBatch.tests?.length === 1 ? 'test' : 'tests'} is currently being reviewed by our lab team.
                </p>
                <p className="mt-2 text-xs text-amber-600">
                  Expected completion: {new Date(currentBatch.estimated_completion_time).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Link
                href={createBatchUrl(currentBatch)}
                className="ml-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
              >
                View Status
              </Link>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-100 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">New Test</h3>
                <p className="text-sm text-gray-600">Analyze a mold sample</p>
              </div>
            </div>
            <Link
              href="/tests/new"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start Analysis
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="rounded-lg bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Test History</h3>
                <p className="text-sm text-gray-600">View past results</p>
              </div>
            </div>
            <Link
              href="/tests"
              className="mt-4 flex w-full items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
            >
              View History
            </Link>
          </div>

        </div>
      </main>
    </div>
    </>
  )
}