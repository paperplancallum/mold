import { createClient as createBrowserClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    const { data: storageData, error: storageError } = await supabase
      .storage
      .listBuckets()
    
    if (storageError) {
      return NextResponse.json(
        { success: false, error: storageError.message },
        { status: 500 }
      )
    }
    
    const hasPetriDishBucket = storageData?.some(
      bucket => bucket.name === 'petri-dish-images'
    )
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
      database: 'Connected',
      storage: hasPetriDishBucket ? 'Bucket found' : 'Bucket not found'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}