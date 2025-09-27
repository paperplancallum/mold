'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'

export default function AnalyzingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/tests/${id}`)
        if (!response.ok) {
          setError('Failed to check status')
          return
        }

        const data = await response.json()
        const test = data.test

        if (test.status === 'completed') {
          router.push(`/tests/${id}`)
        } else if (test.status === 'failed') {
          setError('Analysis failed. Please try again or contact support.')
        }
      } catch (err) {
        setError('Failed to check analysis status')
      }
    }

    pollStatus()
    
    const interval = setInterval(pollStatus, 3000)

    return () => clearInterval(interval)
  }, [id, router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="rounded-lg bg-red-50 p-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 animate-spin rounded-full border-8 border-gray-200 border-t-blue-600"></div>
            <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white">
              <svg
                className="h-12 w-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Analyzing Your Sample
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Our AI is examining your petri dish for mold types, severity, and health risks...
        </p>

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-left">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">What we're analyzing:</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Mold Identification</p>
                <p className="text-sm text-gray-500">Detecting specific mold species</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Severity Assessment</p>
                <p className="text-sm text-gray-500">Evaluating growth density and risk level</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Health Implications</p>
                <p className="text-sm text-gray-500">Assessing potential health risks</p>
              </div>
            </li>
          </ul>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          This usually takes 30-60 seconds
        </p>
      </div>
    </div>
  )
}