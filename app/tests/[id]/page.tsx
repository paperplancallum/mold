'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SeverityBadge from '@/components/SeverityBadge'

export default function TestResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [test, setTest] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTest()
  }, [id])

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/tests/${id}`)
      if (!response.ok) {
        setError('Test not found')
        return
      }
      const data = await response.json()
      setTest(data.test)
    } catch (err) {
      setError('Failed to load test')
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const analysis = test.analysis

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/tests"
            className="rounded-md p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Test Results
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {new Date(test.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Test Information</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{test.location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900">{test.duration}</dd>
              </div>
              {test.temperature && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Temperature</dt>
                  <dd className="mt-1 text-sm text-gray-900">{test.temperature}°F</dd>
                </div>
              )}
              {test.humidity && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Humidity</dt>
                  <dd className="mt-1 text-sm text-gray-900">{test.humidity}%</dd>
                </div>
              )}
            </dl>
            {test.notes && (
              <div className="mt-4">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900">{test.notes}</dd>
              </div>
            )}
          </div>

          {test.image && (
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Petri Dish Image</h2>
              <img
                src={test.image.public_url}
                alt="Petri dish"
                className="w-full rounded-lg border border-gray-200"
              />
            </div>
          )}

          {analysis ? (
            <>
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
                  <SeverityBadge severity={analysis.severity} size="lg" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Overall Confidence</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${analysis.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{analysis.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Identified Mold Types</h2>
                <div className="space-y-3">
                  {analysis.mold_types.map((mold: any, index: number) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <span className="font-medium text-gray-900">{mold.type}</span>
                      <span className="text-sm text-gray-600">{mold.confidence}% confidence</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Colony Count</p>
                    <p className="mt-1 text-lg capitalize text-gray-900">{analysis.colony_count_estimate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Growth Density</p>
                    <p className="mt-1 text-lg capitalize text-gray-900">{analysis.growth_density}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-6">
                <h2 className="text-lg font-semibold text-yellow-900 mb-2">Health Implications</h2>
                <p className="text-sm text-yellow-800">{analysis.health_implications}</p>
              </div>

              <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Recommendations</h2>
                <p className="text-sm text-blue-800 whitespace-pre-line">{analysis.recommendations}</p>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow text-center">
              <p className="text-gray-600">Analysis not yet complete</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/tests"
            className="inline-block rounded-md bg-gray-600 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-500"
          >
            View All Tests
          </Link>
        </div>
      </div>
    </div>
  )
}