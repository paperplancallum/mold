import { createClient } from '@/lib/supabase/server'

export async function uploadImage(
  userId: string,
  testId: string,
  file: File
): Promise<{ path: string; publicUrl: string }> {
  const supabase = await createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${userId}/${testId}/${fileName}`

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
    .getPublicUrl(data.path)

  return {
    path: data.path,
    publicUrl,
  }
}

export async function getImageUrl(path: string): Promise<string> {
  const supabase = await createClient()
  
  const { data } = supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
    .getPublicUrl(path)

  return data.publicUrl
}

export async function deleteImage(path: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
    .remove([path])

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}