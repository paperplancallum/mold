'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const onboardingSteps = [
  {
    title: 'Welcome to MoldScope',
    description: 'Your AI-powered mold analysis companion for DIY testing kits.',
    content: 'MoldScope provides instant analysis of mold growth from your petri dish samples using advanced AI technology.',
  },
  {
    title: 'Capture & Analyze',
    description: 'Take photos of your mold test results and receive instant analysis.',
    content: 'Simply photograph your petri dish samples using your device camera. Our AI will identify mold types, assess severity, and provide health recommendations.',
  },
  {
    title: 'Track Your Tests',
    description: 'Keep a history of all your mold tests in one place.',
    content: 'View past results, compare tests from different rooms, and monitor remediation progress over time.',
  },
  {
    title: 'Get Started',
    description: 'Ready to analyze your first mold sample?',
    content: "You're all set! Click 'Get Started' below to access your dashboard and begin testing.",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('users')
          .update({ has_completed_onboarding: true })
          .eq('id', user.id)

        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      console.error('Error completing onboarding:', err)
      setLoading(false)
    }
  }

  const step = onboardingSteps[currentStep]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {step.title}
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            {step.description}
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          <p className="text-lg text-gray-700">
            {step.content}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSkip}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {currentStep === onboardingSteps.length - 1 ? (loading ? 'Loading...' : 'Get Started') : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}