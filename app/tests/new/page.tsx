'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTestUrl } from '@/lib/url-utils'
import Link from 'next/link'

export default function NewTestPage() {
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState('48h')
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!location.trim()) {
      setError('Location is required')
      return
    }

    if (humidity && (parseFloat(humidity) < 0 || parseFloat(humidity) > 100)) {
      setError('Humidity must be between 0 and 100')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location.trim(),
          duration,
          temperature: temperature ? parseFloat(temperature) : null,
          humidity: humidity ? parseFloat(humidity) : null,
          notes: notes.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to create test')
        setLoading(false)
        return
      }

      const test = await response.json()
      const testUrl = createTestUrl({ display_id: test.display_id })
      router.push(`${testUrl}/upload`)
    } catch (err) {
      setError('Unable to connect. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard"
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
              New Mold Test
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter details about your test sample
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="e.g., Basement, Bathroom, Kitchen"
                  maxLength={200}
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Test Duration *
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="24h">24 hours</option>
                  <option value="48h">48 hours</option>
                  <option value="72h">72 hours</option>
                  <option value="96h">96 hours</option>
                  <option value="1-week">1 week</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="temperature"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Temperature (°F) <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="e.g., 72"
                  />
                </div>

                <div>
                  <label
                    htmlFor="humidity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Humidity (%) <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="humidity"
                    name="humidity"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="e.g., 65"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Any additional observations..."
                  maxLength={1000}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Continue to Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}