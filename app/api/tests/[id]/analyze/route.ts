import { createClient } from '@/lib/supabase/server'
import { parseTestUrl } from '@/lib/url-utils'
import { openai, buildMoldAnalysisPrompt } from '@/lib/openai'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = request.headers.get('x-internal-api-key')
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const { id: rawId } = await params
    const displayId = parseInt(parseTestUrl(rawId), 10)
    
    if (isNaN(displayId)) {
      return NextResponse.json(
        { error: 'Invalid test ID', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()

    const { data: test } = await supabase
      .from('tests')
      .select(`
        *,
        test_images (*)
      `)
      .eq('display_id', displayId)
      .single()

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    const image = test.test_images?.[0]
    if (!image) {
      return NextResponse.json(
        { error: 'No image uploaded for this test', code: 'NO_IMAGE' },
        { status: 400 }
      )
    }

    await supabase
      .from('tests')
      .update({ status: 'analyzing' })
      .eq('display_id', displayId)

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET}/${image.storage_path}`

    const prompt = buildMoldAnalysisPrompt({
      duration: test.duration,
      temperature: test.temperature,
      humidity: test.humidity,
      notes: test.notes,
      location: test.location,
    })

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 1500,
        temperature: 0.5,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      let analysis
      try {
        let jsonContent = content.trim()
        if (jsonContent.startsWith('```json')) {
          jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (jsonContent.startsWith('```')) {
          jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
        analysis = JSON.parse(jsonContent)
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content)
        throw new Error('Invalid JSON response from AI')
      }

      const { data: analysisRecord, error: insertError } = await supabase
        .from('analysis_results')
        .insert({
          test_id: test.id,
          mold_types: analysis.mold_types,
          confidence: analysis.overall_confidence,
          severity: analysis.severity,
          colony_count_estimate: analysis.colony_count,
          growth_density: analysis.growth_density,
          health_implications: analysis.health_implications,
          recommendations: analysis.recommendations,
          raw_response: analysis,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Database error saving analysis:', insertError)
        throw new Error('Failed to save analysis results')
      }

      await supabase
        .from('tests')
        .update({ status: 'completed' })
        .eq('display_id', displayId)

      if (test.batch_id) {
        const { data: batchTests } = await supabase
          .from('tests')
          .select('id, status')
          .eq('batch_id', test.batch_id)

        const allComplete = batchTests?.every(t => 
          t.status === 'completed' || t.status === 'failed'
        )

        if (allComplete) {
          await supabase
            .from('batches')
            .update({ status: 'completed' })
            .eq('id', test.batch_id)
        }
      }

      return NextResponse.json({
        analysis_id: analysisRecord.id,
        status: 'completed',
      })
    } catch (aiError) {
      console.error('OpenAI API error:', aiError)
      
      await supabase
        .from('tests')
        .update({ status: 'failed' })
        .eq('display_id', displayId)

      return NextResponse.json(
        {
          error: 'AI analysis failed. Please try again.',
          code: 'AI_ERROR',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error analyzing test:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}