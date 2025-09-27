'use client'

import { useDropzone } from 'react-dropzone'
import { useState } from 'react'

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>
  uploading?: boolean
}

export default function ImageUpload({ onUpload, uploading = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')

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

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          } ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <input {...getInputProps()} capture={isMobile ? 'environment' : undefined} />
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
                  {isMobile ? 'Tap to take photo or choose file' : 'Drag & drop petri dish image'}
                </p>
                <p className="text-sm text-gray-500">
                  {isMobile ? 'JPG, PNG, HEIC, or WEBP (max 10MB)' : 'or click to select file • JPG, PNG, HEIC, WEBP (max 10MB)'}
                </p>
              </>
            )}
          </div>
        </div>
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