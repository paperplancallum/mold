'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { parseBatchUrl, createTestUrl } from '@/lib/url-utils'
import Link from 'next/link'
import SeverityBadge from '@/components/SeverityBadge'

interface BatchPageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default function BatchPage({ params }: BatchPageProps) {
  const [batch, setBatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchBatch = async () => {
      const { id: rawId } = await params
      const id = parseBatchUrl(rawId)

      const response = await fetch(`/api/batches/${id}`)
      if (!response.ok) {
        const data = await response.json()
        if (response.status === 403) {
          router.push('/dashboard')
          return
        }
        setError(data.error || 'Failed to load batch')
        setLoading(false)
        return
      }

      const data = await response.json()
      setBatch(data.batch)
      setLoading(false)
    }

    fetchBatch()
  }, [params, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error || !batch) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error || 'Batch not found'}</p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isInReview = batch.status === 'in_review'
  const isCompleted = batch.status === 'completed'
  const testCount = batch.tests?.length || 0

  return (
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
              <Link
                href="/dashboard"
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Lab Review Batch</h2>
              <p className="mt-1 text-sm text-gray-600">
                Submitted {new Date(batch.submitted_at).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex-shrink-0">
              {isInReview && (
                <span className="inline-flex items-center whitespace-nowrap rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                  In Review
                </span>
              )}
              {isCompleted && (
                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  Completed
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-4 border-t border-gray-200 pt-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Batch ID</p>
              <p className="mt-1 text-base font-mono text-gray-900">{batch.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Expected Completion</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {new Date(batch.estimated_completion_time).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{testCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Time Remaining</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {isCompleted ? 'Complete' : (() => {
                  const now = new Date()
                  const completion = new Date(batch.estimated_completion_time)
                  const diff = completion.getTime() - now.getTime()
                  const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)))
                  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)))
                  return diff <= 0 ? 'Processing...' : `${hours}h ${minutes}m`
                })()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">Tests in this Batch</h3>
          <div className="space-y-3">
            {batch.tests?.map((test: any) => (
              <Link
                key={test.id}
                href={isCompleted ? createTestUrl(test) : '#'}
                className={`group flex flex-col sm:flex-row items-start gap-3 rounded-lg border border-gray-200 p-3 sm:p-4 ${
                  isCompleted ? 'transition-colors hover:border-blue-300 hover:bg-blue-50' : 'cursor-default'
                }`}
              >
                <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-1">
                  {test.test_images?.[0] ? (
                    <img
                      src={test.test_images[0].public_url}
                      alt={test.location}
                      className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <svg className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm sm:text-base font-semibold text-gray-900 truncate ${isCompleted ? 'group-hover:text-blue-600' : ''}`}>
                      {test.location}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {test.id.slice(0, 8).toUpperCase()}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600">
                      <span>Duration: {test.duration}</span>
                      {test.temperature && <span>Temp: {test.temperature}°F</span>}
                      {test.humidity && <span>Humidity: {test.humidity}%</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  {test.status === 'completed' && test.analysis_results?.[0] && (
                    <SeverityBadge severity={test.analysis_results[0].severity} size="sm" />
                  )}
                  {test.status === 'in_review' && (
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                      In Review
                    </span>
                  )}
                  {test.status === 'analyzing' && (
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Analyzing
                    </span>
                  )}
                  {test.status === 'completed' && (
                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Complete
                    </span>
                  )}
                  {isCompleted && (
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {isInReview && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Your tests are currently being reviewed by our lab technician. You'll be notified when the results are ready.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}