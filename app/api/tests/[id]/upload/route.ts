import { createClient } from '@/lib/supabase/server'
import { parseTestUrl } from '@/lib/url-utils'
import { NextResponse } from 'next/server'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/webp']

export async function POST(
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
      .select('id')
      .eq('user_id', user.id)
      .eq('display_id', displayId)
      .single()

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit', code: 'FILE_TOO_LARGE' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, HEIC, WEBP', code: 'INVALID_FILE_TYPE' },
        { status: 400 }
      )
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${test.id}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image', code: 'STORAGE_ERROR' },
        { status: 500 }
      )
    }

    const { data: imageRecord, error: insertError } = await supabase
      .from('test_images')
      .insert({
        test_id: test.id,
        storage_path: uploadData.path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
        .remove([uploadData.path])
      
      return NextResponse.json(
        { error: 'Failed to save image record', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET}/${uploadData.path}`

    await supabase
      .from('tests')
      .update({ status: 'ready_for_review' })
      .eq('user_id', user.id)
      .eq('display_id', displayId)

    return NextResponse.json({
      image_id: imageRecord.id,
      storage_path: uploadData.path,
      public_url: publicUrl,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}