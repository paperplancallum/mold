import { createClient } from '@/lib/supabase/server'
import { openai, MOLD_ANALYSIS_PROMPT } from '@/lib/openai'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: test } = await supabase
      .from('tests')
      .select(`
        *,
        test_images (*)
      `)
      .eq('id', testId)
      .eq('user_id', user.id)
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
      .eq('id', testId)

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET}/${image.storage_path}`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: MOLD_ANALYSIS_PROMPT },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      let analysis
      try {
        analysis = JSON.parse(content)
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content)
        throw new Error('Invalid JSON response from AI')
      }

      const { data: analysisRecord, error: insertError } = await supabase
        .from('analysis_results')
        .insert({
          test_id: testId,
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
        .eq('id', testId)

      return NextResponse.json({
        analysis_id: analysisRecord.id,
        status: 'completed',
      })
    } catch (aiError) {
      console.error('OpenAI API error:', aiError)
      
      await supabase
        .from('tests')
        .update({ status: 'failed' })
        .eq('id', testId)

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