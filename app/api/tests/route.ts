import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { location, duration, temperature, humidity, notes } = body

    if (!location || !location.trim()) {
      return NextResponse.json(
        { error: 'Location is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    if (!['24h', '48h', '72h', '96h', '1-week'].includes(duration)) {
      return NextResponse.json(
        { error: 'Invalid duration value', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    if (humidity !== null && humidity !== undefined && (humidity < 0 || humidity > 100)) {
      return NextResponse.json(
        { error: 'Humidity must be between 0 and 100', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const { data: test, error: insertError } = await supabase
      .from('tests')
      .insert({
        user_id: user.id,
        location: location.trim(),
        duration,
        temperature: temperature || null,
        humidity: humidity || null,
        notes: notes?.trim() || null,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create test', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json(test, { status: 201 })
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('tests')
      .select(`
        *,
        test_images (
          id,
          storage_path,
          file_name
        ),
        analysis_results (
          severity,
          confidence
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: tests, error: queryError } = await query

    if (queryError) {
      console.error('Database error:', queryError)
      return NextResponse.json(
        { error: 'Failed to fetch tests', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    const { count } = await supabase
      .from('tests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const testsWithUrls = tests.map(test => {
      const image = test.test_images?.[0]
      const analysisResults = Array.isArray(test.analysis_results)
        ? test.analysis_results[0]
        : test.analysis_results
      
      return {
        ...test,
        image: image ? {
          ...image,
          public_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET}/${image.storage_path}`,
        } : null,
        analysis: analysisResults ? {
          severity: analysisResults.severity,
          confidence: analysisResults.confidence,
        } : null,
        test_images: undefined,
        analysis_results: undefined,
      }
    })

    return NextResponse.json({
      tests: testsWithUrls,
      total: count || 0,
    })
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}