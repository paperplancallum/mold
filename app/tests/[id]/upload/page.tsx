'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

export default function UploadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [test, setTest] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
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

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const uploadResponse = await fetch(`/api/tests/${id}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json()
        throw new Error(data.error || 'Upload failed')
      }

      const analyzeResponse = await fetch(`/api/tests/${id}/analyze`, {
        method: 'POST',
      })

      if (!analyzeResponse.ok) {
        const data = await analyzeResponse.json()
        throw new Error(data.error || 'Analysis failed')
      }

      router.push(`/tests/${id}/analyzing`)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setUploading(false)
    }
  }

  if (error && !test) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Upload Petri Dish Image
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Test location: <span className="font-medium">{test.location}</span>
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <ImageUpload onUpload={handleUpload} uploading={uploading} />
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}