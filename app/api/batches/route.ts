import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const { count } = await supabase
      .from('batches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { data: batches, error: batchesError } = await supabase
      .from('batches')
      .select(`
        id,
        submitted_at,
        estimated_completion_time,
        status,
        technician_name,
        tests (id)
      `)
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (batchesError) {
      console.error('Error fetching batches:', batchesError)
      return NextResponse.json(
        { error: 'Failed to fetch batches', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    const batchesWithCounts = batches.map(batch => ({
      id: batch.id,
      submitted_at: batch.submitted_at,
      estimated_completion_time: batch.estimated_completion_time,
      status: batch.status,
      technician_name: batch.technician_name,
      test_count: Array.isArray(batch.tests) ? batch.tests.length : 0,
    }))

    return NextResponse.json({
      batches: batchesWithCounts,
      total: count || 0,
    })
  } catch (error) {
    console.error('Error in batches list endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}