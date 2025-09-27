import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    const { data: dueBatches, error: batchError } = await supabase
      .from('batches')
      .select(`
        id,
        tests (id)
      `)
      .eq('status', 'in_review')
      .lte('estimated_completion_time', new Date().toISOString())
      .limit(100)

    if (batchError) {
      console.error('Error fetching due batches:', batchError)
      return NextResponse.json(
        { error: 'Failed to fetch batches', processed: 0 },
        { status: 500 }
      )
    }

    if (!dueBatches || dueBatches.length === 0) {
      return NextResponse.json({
        message: 'No batches ready for processing',
        processed: 0,
      })
    }

    console.log(`Processing ${dueBatches.length} batches...`)

    let processedCount = 0
    let failedCount = 0

    for (const batch of dueBatches) {
      try {
        const testIds = Array.isArray(batch.tests) ? batch.tests.map((t: any) => t.id) : []
        
        if (testIds.length === 0) {
          console.warn(`Batch ${batch.id} has no tests, skipping`)
          continue
        }

        const analysisPromises = testIds.map(async (testId: string) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tests/${testId}/analyze`,
              {
                method: 'POST',
                headers: {
                  'x-internal-api-key': process.env.INTERNAL_API_KEY!,
                },
              }
            )

            if (!response.ok) {
              const error = await response.json()
              console.error(`Analysis failed for test ${testId}:`, error)
              return { testId, success: false, error }
            }

            return { testId, success: true }
          } catch (error) {
            console.error(`Exception analyzing test ${testId}:`, error)
            return { testId, success: false, error }
          }
        })

        const results = await Promise.allSettled(analysisPromises)
        
        console.log(`Batch ${batch.id}: Processed ${results.length} tests`)
        
        const successCount = results.filter(
          r => r.status === 'fulfilled' && r.value.success
        ).length
        
        if (successCount > 0) {
          processedCount++
        } else {
          failedCount++
        }
      } catch (error) {
        console.error(`Error processing batch ${batch.id}:`, error)
        failedCount++
      }
    }

    return NextResponse.json({
      message: 'Batch processing complete',
      processed: processedCount,
      failed: failedCount,
      total: dueBatches.length,
    })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      { error: 'Internal server error', processed: 0 },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'