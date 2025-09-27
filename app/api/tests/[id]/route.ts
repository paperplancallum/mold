import { createClient } from '@/lib/supabase/server'
import { parseTestUrl } from '@/lib/url-utils'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params
    const displayId = parseInt(parseTestUrl(rawId), 10)
    
    if (isNaN(displayId)) {
      return NextResponse.json(
        { error: 'Invalid test ID', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: test, error: queryError } = await supabase
      .from('tests')
      .select(`
        *,
        test_images (*),
        analysis_results (*)
      `)
      .eq('user_id', user.id)
      .eq('display_id', displayId)
      .single()

    if (queryError || !test) {
      return NextResponse.json(
        { error: 'Test not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    const image = test.test_images?.[0]
    const analysis = Array.isArray(test.analysis_results) 
      ? test.analysis_results[0] 
      : test.analysis_results

    const formattedTest = {
      ...test,
      image: image ? {
        ...image,
        public_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET}/${image.storage_path}`,
      } : null,
      analysis: analysis || null,
      test_images: undefined,
      analysis_results: undefined,
    }

    return NextResponse.json({ test: formattedTest })
  } catch (error) {
    console.error('Error fetching test:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params
    const displayId = parseInt(parseTestUrl(rawId), 10)
    
    if (isNaN(displayId)) {
      return NextResponse.json(
        { error: 'Invalid test ID', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: test } = await supabase
      .from('tests')
      .select('*, test_images (*)')
      .eq('user_id', user.id)
      .eq('display_id', displayId)
      .single()

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    if (test.test_images && test.test_images.length > 0) {
      for (const image of test.test_images) {
        await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
          .remove([image.storage_path])
      }
    }

    const { error: deleteError } = await supabase
      .from('tests')
      .delete()
      .eq('user_id', user.id)
      .eq('display_id', displayId)

    if (deleteError) {
      console.error('Database error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete test', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting test:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}