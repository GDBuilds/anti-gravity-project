import { supabase } from './supabase'

/**
 * Uploads a file to a Supabase bucket.
 * @param {string} bucket - The name of the bucket.
 * @param {string} path - The path inside the bucket.
 * @param {File} file - The file to upload.
 * @returns {Promise<{url: string, error: any}>}
 */
export const uploadFile = async (bucket, path, file) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { url: null, error }
  }
}

/**
 * Deletes a file from a Supabase bucket.
 * @param {string} bucket - The name of the bucket.
 * @param {string} path - The path inside the bucket.
 */
export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) {
    console.error('Error deleting file:', error)
  }
}
