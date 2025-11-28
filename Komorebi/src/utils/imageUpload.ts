import { supabase } from '../lib/supabaseClient'

/**
 * Create a storage bucket if it doesn't exist
 * @param bucketName - Name of the bucket to create
 */
const createBucketIfNotExists = async (bucketName: string): Promise<void> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return // Don't throw, just log and continue
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`)
      
      // Create bucket with public access
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB limit
      })
      
      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error)
        // Don't throw here, we'll handle the upload error separately
      } else {
        console.log(`Bucket ${bucketName} created successfully`)
      }
    } else {
      console.log(`Bucket ${bucketName} already exists`)
    }
  } catch (error) {
    console.error('Error checking/creating bucket:', error)
    // Don't throw, let the upload attempt continue
  }
}

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @param folder - The folder path in storage (e.g., 'products', 'profiles')
 * @returns Promise with the public URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'products'): Promise<string> => {
  try {
    console.log('Starting image upload process...')
    
    // Validate file
    if (!file) throw new Error('No file provided')
    if (!file.type.startsWith('image/')) throw new Error('File must be an image')
    if (file.size > 5242880) throw new Error('File size must be less than 5MB')

    console.log('File validation passed:', file.name, file.type, file.size)

    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    console.log('Generated file path:', filePath)

    // First, try to create the bucket if it doesn't exist
    console.log('Checking/creating bucket...')
    await createBucketIfNotExists('images')

    console.log('Attempting to upload file to Supabase Storage...')
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase storage upload error:', error)
      throw error
    }

    console.log('Upload successful, getting public URL...')

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    if (!publicUrl) throw new Error('Failed to get public URL')

    console.log('Public URL generated:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

/**
 * Upload multiple images
 * @param files - Array of image files
 * @param folder - The folder path in storage
 * @returns Promise with array of public URLs
 */
export const uploadMultipleImages = async (files: File[], folder: string = 'products'): Promise<string[]> => {
  try {
    // Ensure bucket exists
    await createBucketIfNotExists('images')
    
    const uploadPromises = files.map(file => uploadImage(file, folder))
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    throw error
  }
}

/**
 * Initialize storage buckets for the application
 */
export const initializeStorage = async (): Promise<void> => {
  try {
    console.log('Initializing storage...')
    await createBucketIfNotExists('images')
    console.log('Storage initialization completed')
  } catch (error) {
    console.error('Error initializing storage:', error)
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imagePath - The path of the image to delete
 */
export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([imagePath])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}