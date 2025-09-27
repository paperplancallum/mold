'use client'

import { useDropzone } from 'react-dropzone'
import { useState, useRef, useEffect } from 'react'

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>
  uploading?: boolean
}

export default function ImageUpload({ onUpload, uploading = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/webp': ['.webp']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: uploading,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      setError('')
      
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('File size exceeds 10MB limit')
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Please use JPG, PNG, HEIC, or WEBP')
        } else {
          setError('Invalid file')
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
        
        try {
          await onUpload(file)
        } catch (err) {
          setError('Upload failed. Please try again.')
          setPreview(null)
        }
      }
    }
  })

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setShowCamera(true)
      setError('')
    } catch (err) {
      setError('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    
    canvas.toBlob(async (blob) => {
      if (!blob) return
      
      const file = new File([blob], 'petri-dish.jpg', { type: 'image/jpeg' })
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      stopCamera()
      
      try {
        await onUpload(file)
      } catch (err) {
        setError('Upload failed. Please try again.')
        setPreview(null)
      }
    }, 'image/jpeg', 0.9)
  }

  if (showCamera) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.8"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="2"
            />
          </svg>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black bg-opacity-60 px-4 py-2">
            <p className="text-xs text-white font-medium">Center the petri dish in the circle</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={stopCamera}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={capturePhoto}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Capture Photo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <>
          {isMobile && (
            <button
              onClick={startCamera}
              disabled={uploading}
              className="w-full rounded-lg border-2 border-blue-500 bg-blue-50 p-6 text-center hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-3">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-blue-900">Open Camera</p>
              <p className="text-sm text-blue-700 mt-1">Take photo with guided overlay</p>
            </button>
          )}

          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            } ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-12 w-12 text-gray-400"
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
              {isDragActive ? (
                <p className="text-lg text-blue-600">Drop image here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-900">
                    {isMobile ? 'Choose file from gallery' : 'Drag & drop petri dish image'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isMobile ? 'JPG, PNG, HEIC, or WEBP (max 10MB)' : 'or click to select file • JPG, PNG, HEIC, WEBP (max 10MB)'}
                  </p>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-white">
            <img
              src={preview}
              alt="Preview"
              className="h-auto w-full"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-center text-white">
                  <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                  <p className="text-sm font-medium">Uploading...</p>
                </div>
              </div>
            )}
          </div>
          {!uploading && (
            <button
              onClick={() => {
                URL.revokeObjectURL(preview)
                setPreview(null)
                setError('')
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Choose Different Image
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-medium text-blue-900">Tips for best results:</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700">
          <li>Ensure good lighting - avoid shadows</li>
          <li>Position camera directly above petri dish</li>
          <li>Capture the entire dish in frame</li>
          <li>Keep camera steady for clear focus</li>
        </ul>
      </div>
    </div>
  )
}