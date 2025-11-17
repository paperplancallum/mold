import { createClient } from '@/lib/supabase/server'
import { parseBatchUrl } from '@/lib/url-utils'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params
    const displayId = parseInt(parseBatchUrl(rawId), 10)
    
    if (isNaN(displayId)) {
      return NextResponse.json(
        { error: 'Invalid batch ID', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
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
          display_id,
          location,
          status,
          duration,
          temperature,
          humidity,
          test_images (
            id,
            storage_path,
            file_name
          ),
          analysis_results (
            severity,
            confidence
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('display_id', displayId)
      .single()

    if (batchError) {
      console.error('Error fetching batch:', batchError)
      if (batchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Batch not found', code: 'BATCH_NOT_FOUND' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch batch', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    if (batch.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have access to this batch', code: 'UNAUTHORIZED_BATCH' },
        { status: 403 }
      )
    }

    const testsWithDetails = batch.tests.map((test: any) => {
      const image = test.test_images?.[0]
      return {
        id: test.id,
        location: test.location,
        status: test.status,
        duration: test.duration,
        temperature: test.temperature,
        humidity: test.humidity,
        test_images: image ? [{
          ...image,
          public_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET}/${image.storage_path}`,
        }] : [],
        analysis_results: test.analysis_results || [],
      }
    })

    return NextResponse.json({
      batch: {
        id: batch.id,
        submitted_at: batch.submitted_at,
        estimated_completion_time: batch.estimated_completion_time,
        status: batch.status,
        technician_name: batch.technician_name,
        tests: testsWithDetails,
      },
    })
  } catch (error) {
    console.error('Error in batch detail endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}