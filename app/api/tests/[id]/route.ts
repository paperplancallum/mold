import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (queryError || !test) {
      return NextResponse.json(
        { error: 'Test not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    const image = test.test_images?.[0]
    const analysis = test.analysis_results?.[0]

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