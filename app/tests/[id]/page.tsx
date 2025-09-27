'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { parseTestUrl } from '@/lib/url-utils'
import SeverityBadge from '@/components/SeverityBadge'

function getHealthImplications(moldType: string) {
  const healthData: Record<string, { risks: string; symptoms: string; atRisk: string }> = {
    'Aspergillus Niger': {
      risks: 'Can cause aspergillosis, a respiratory infection that ranges from mild to severe. May produce mycotoxins that can affect lung function.',
      symptoms: 'Coughing, wheezing, shortness of breath, fever, chest pain, and in severe cases, invasive lung infection.',
      atRisk: 'Immunocompromised individuals, people with existing lung conditions, transplant recipients, and those undergoing chemotherapy.'
    },
    'Aspergillus': {
      risks: 'Can cause aspergillosis, a respiratory infection that ranges from mild to severe. May produce mycotoxins that can affect lung function.',
      symptoms: 'Coughing, wheezing, shortness of breath, fever, chest pain, and in severe cases, invasive lung infection.',
      atRisk: 'Immunocompromised individuals, people with existing lung conditions, transplant recipients, and those undergoing chemotherapy.'
    },
    'Penicillium': {
      risks: 'Common allergen that can trigger respiratory issues. Some species produce mycotoxins. Generally causes allergic reactions rather than infections.',
      symptoms: 'Sneezing, runny nose, nasal congestion, watery eyes, coughing, and skin rashes. May worsen asthma symptoms.',
      atRisk: 'People with mold allergies, asthma sufferers, children, elderly individuals, and those with weakened immune systems.'
    },
    'Cladosporium': {
      risks: 'Generally considered less harmful than other molds, but can still cause allergic reactions and respiratory issues in sensitive individuals.',
      symptoms: 'Hay fever-like symptoms, sneezing, stuffy nose, itchy eyes, skin irritation, and respiratory discomfort.',
      atRisk: 'Individuals with asthma, mold allergies, or respiratory sensitivities. Generally well-tolerated by healthy individuals.'
    },
    'Stachybotrys': {
      risks: 'Known as "black mold," produces mycotoxins that can cause serious health issues. Requires immediate professional remediation.',
      symptoms: 'Severe respiratory issues, chronic coughing, fatigue, headaches, memory problems, and skin irritation.',
      atRisk: 'Everyone, especially children, elderly, pregnant women, and those with compromised immune systems or respiratory conditions.'
    },
    'Alternaria': {
      risks: 'Common outdoor mold that can cause allergic reactions. One of the most common allergenic molds.',
      symptoms: 'Asthma attacks, allergic rhinitis, sneezing, itchy eyes, and upper respiratory symptoms.',
      atRisk: 'People with allergies or asthma, particularly those with sensitivity to outdoor allergens.'
    }
  }

  return healthData[moldType] || {
    risks: 'May cause allergic reactions and respiratory issues in sensitive individuals. Professional assessment recommended.',
    symptoms: 'Potential for coughing, sneezing, respiratory discomfort, and allergic reactions.',
    atRisk: 'Individuals with allergies, asthma, or compromised immune systems.'
  }
}

export default function TestResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params)
  const id = parseTestUrl(rawId)
  const [test, setTest] = useState<any>(null)
  const [error, setError] = useState('')
  const [retrying, setRetrying] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchTest()
  }, [id])

  useEffect(() => {
    if (test?.status === 'analyzing') {
      router.push(`/tests/${id}/analyzing`)
    }
  }, [test, id, router])

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

  const handleRetry = async () => {
    setRetrying(true)
    setError('')

    try {
      const response = await fetch(`/api/tests/${id}/analyze`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Retry failed')
        setRetrying(false)
        return
      }

      router.push(`/tests/${id}/analyzing`)
    } catch (err) {
      setError('Failed to retry analysis')
      setRetrying(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/tests/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to delete test')
        setDeleting(false)
        return
      }

      router.push('/tests')
    } catch (err) {
      setError('Failed to delete test')
      setDeleting(false)
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
            <p className="mt-1 text-sm text-gray-500 font-mono">ID: {test.id.slice(0, 8).toUpperCase()}</p>
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
                <div className="space-y-4">
                  {analysis.mold_types.map((mold: any, index: number) => {
                    const confidenceColor = mold.confidence >= 80 ? 'bg-green-600' : mold.confidence >= 60 ? 'bg-blue-600' : 'bg-yellow-600'
                    const confidenceLabel = mold.confidence >= 80 ? 'High' : mold.confidence >= 60 ? 'Medium' : 'Low'
                    return (
                      <div key={index} className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{mold.type}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">Confidence:</span>
                            <span className="text-sm font-semibold text-gray-900">{mold.confidence}%</span>
                            <span className={`text-xs font-medium ${mold.confidence >= 80 ? 'text-green-700' : mold.confidence >= 60 ? 'text-blue-700' : 'text-yellow-700'}`}>
                              ({confidenceLabel})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${confidenceColor} rounded-full transition-all`}
                              style={{ width: `${mold.confidence}%` }}
                            />
                          </div>
                        </div>
                        {mold.identifying_features && (
                          <p className="mt-2 text-xs text-gray-600">{mold.identifying_features}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Colony Count</p>
                      <span className="text-sm font-semibold capitalize text-gray-900">{analysis.colony_count_estimate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Low</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full transition-all"
                          style={{ 
                            width: `${{
                              low: '25%',
                              moderate: '50%',
                              high: '75%',
                              extensive: '100%'
                            }[analysis.colony_count_estimate] || '50%'}` 
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">Extensive</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Growth Density</p>
                      <span className="text-sm font-semibold capitalize text-gray-900">{analysis.growth_density}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Sparse</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-red-600 rounded-full transition-all"
                          style={{ 
                            width: `${{
                              sparse: '33%',
                              moderate: '66%',
                              dense: '100%'
                            }[analysis.growth_density] || '66%'}` 
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">Dense</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Implications</h2>
                <div className="space-y-4">
                  {analysis.mold_types.map((mold: any, index: number) => {
                    const healthInfo = getHealthImplications(mold.type)
                    return (
                      <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">{mold.type}</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                          <div>
                            <p className="font-medium text-gray-900 mb-1">Health Risks:</p>
                            <p>{healthInfo.risks}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 mb-1">Symptoms:</p>
                            <p>{healthInfo.symptoms}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 mb-1">At-Risk Groups:</p>
                            <p>{healthInfo.atRisk}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Recommendations</h2>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  {analysis.recommendations.split(/[.\n]\s*/).filter((item: string) => item.trim()).map((item: string, index: number) => (
                    <li key={index}>{item.trim()}{item.trim().match(/[.!]$/) ? '' : '.'}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : test.status === 'failed' ? (
            <div className="rounded-lg border-l-4 border-red-400 bg-red-50 p-6">
              <div className="flex items-start gap-4">
                <svg className="h-6 w-6 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900">Analysis Failed</h3>
                  <p className="mt-2 text-sm text-red-800">
                    We encountered an error while analyzing your sample. This could be due to image quality, 
                    connection issues, or temporary service problems.
                  </p>
                  <button
                    onClick={handleRetry}
                    disabled={retrying}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {retrying ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retrying...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry Analysis
                      </>
                    )}
                  </button>
                  {error && (
                    <p className="mt-3 text-sm text-red-700">{error}</p>
                  )}
                </div>
              </div>
            </div>
          ) : test.status === 'pending' ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Image Upload Required</h3>
              <p className="mt-2 text-sm text-gray-600">
                Please upload a petri dish image to begin analysis.
              </p>
              <Link
                href={`/tests/${id}/upload`}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Upload Image
              </Link>
            </div>
          ) : test.status === 'in_review' ? (
            <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-6">
              <div className="flex items-start gap-4">
                <svg className="h-6 w-6 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-900">Under Lab Review</h3>
                  <p className="mt-2 text-sm text-amber-800">
                    Your test is currently being reviewed by our lab team.
                  </p>
                  {test.estimated_completion_time && (
                    <p className="mt-3 text-sm font-medium text-amber-900">
                      Expected completion: {new Date(test.estimated_completion_time).toLocaleString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow text-center">
              <p className="text-gray-600">Analysis not yet complete</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/tests"
            className="inline-block rounded-md bg-gray-600 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-500"
          >
            View All Tests
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Test
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}