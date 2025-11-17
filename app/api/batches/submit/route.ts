import { createClient } from '@/lib/supabase/server'
import { getRandomTechnician } from '@/lib/lab-technicians'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const { data: readyTests, error: testsError } = await supabase
      .from('tests')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'ready_for_review')

    if (testsError) {
      console.error('Error fetching ready tests:', testsError)
      return NextResponse.json(
        { error: 'Failed to fetch tests', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    if (!readyTests || readyTests.length === 0) {
      return NextResponse.json(
        { error: 'No tests ready for review', code: 'NO_TESTS_READY' },
        { status: 400 }
      )
    }

    const submittedAt = new Date()
    const estimatedCompletionTime = new Date(submittedAt.getTime() + 48 * 60 * 60 * 1000)
    const technicianName = getRandomTechnician()

    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .insert({
        user_id: user.id,
        submitted_at: submittedAt.toISOString(),
        estimated_completion_time: estimatedCompletionTime.toISOString(),
        status: 'in_review',
        technician_name: technicianName,
      })
      .select()
      .single()

    if (batchError) {
      console.error('Error creating batch:', batchError)
      return NextResponse.json(
        { error: 'Failed to create batch', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    const testIds = readyTests.map(t => t.id)
    const { error: updateError } = await supabase
      .from('tests')
      .update({
        batch_id: batch.id,
        status: 'in_review',
        submitted_at: submittedAt.toISOString(),
        estimated_completion_time: estimatedCompletionTime.toISOString(),
        reviewed_by_technician: technicianName,
      })
      .in('id', testIds)

    if (updateError) {
      console.error('Error updating tests:', updateError)
      
      await supabase.from('batches').delete().eq('id', batch.id)
      
      return NextResponse.json(
        { error: 'Failed to update tests', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      batch_id: batch.id,
      display_id: batch.display_id,
      test_count: testIds.length,
      submitted_at: submittedAt.toISOString(),
      estimated_completion_time: estimatedCompletionTime.toISOString(),
      technician_name: technicianName,
    })
  } catch (error) {
    console.error('Error submitting batch:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}