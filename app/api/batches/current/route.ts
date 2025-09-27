import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .select(`
        *,
        tests (
          id,
          location,
          status,
          test_images (public_url)
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'in_review')
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single()

    if (batchError && batchError.code !== 'PGRST116') {
      console.error('Error fetching batch:', batchError)
      return NextResponse.json(
        { error: 'Failed to fetch batch', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    if (!batch || batchError?.code === 'PGRST116') {
      return NextResponse.json({ batch: null })
    }

    const testsWithImages = batch.tests.map((test: any) => ({
      id: test.id,
      location: test.location,
      status: test.status,
      image_url: test.test_images?.[0]?.public_url || null,
    }))

    return NextResponse.json({
      batch: {
        id: batch.id,
        submitted_at: batch.submitted_at,
        estimated_completion_time: batch.estimated_completion_time,
        status: batch.status,
        technician_name: batch.technician_name,
        test_count: testsWithImages.length,
        tests: testsWithImages,
      },
    })
  } catch (error) {
    console.error('Error in current batch endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}