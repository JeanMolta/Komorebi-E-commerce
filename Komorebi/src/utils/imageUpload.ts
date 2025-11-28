import { supabase } from '../lib/supabaseClient'

/**
 * Create a storage bucket if it doesn't exist
 * @param bucketName - Name of the bucket to create
 */
const createBucketIfNotExists = async (bucketName: string): Promise<void> => {
  try {
    console.log(`Checking if bucket '${bucketName}' exists...`)
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return // Don't throw, just log and continue
    }
    
    console.log('Available buckets:', buckets?.map(b => b.name) || [])
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`)
      
      // Create bucket with public access
      const { data: newBucket, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB limit
      })
      
      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error)
        // Try to continue anyway, maybe bucket exists but wasn't listed
      } else {
        console.log(`Bucket ${bucketName} created successfully:`, newBucket)
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
    console.log('🔄 Starting image upload process...')
    console.log('📄 File details:', { 
      name: file.name, 
      type: file.type, 
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB` 
    })
    
    // Validate file
    if (!file) throw new Error('No file provided')
    if (!file.type.startsWith('image/')) throw new Error('File must be an image')
    if (file.size > 5242880) throw new Error('File size must be less than 5MB')

    console.log('✅ File validation passed')

    // Generate a unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    console.log('📂 Generated file path:', filePath)

    // First, try to create the bucket if it doesn't exist
    console.log('🪣 Checking/creating storage bucket...')
    await createBucketIfNotExists('images')

    console.log('⬆️ Uploading file to Supabase Storage...')
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true  // Allow overwriting files
      })

    if (uploadError) {
      console.error('❌ Supabase storage upload error:', uploadError)
      console.error('Error details:', {
        message: uploadError.message,
        statusCode: (uploadError as any).statusCode
      })
      throw uploadError
    }

    console.log('✅ Upload successful:', uploadData)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    if (!publicUrl) {
      console.error('❌ Failed to generate public URL')
      throw new Error('Failed to get public URL')
    }

    console.log('🔗 Public URL generated:', publicUrl)

    // Test if the URL is actually accessible
    try {
      const testResponse = await fetch(publicUrl, { method: 'HEAD' })
      console.log('🌐 URL accessibility test:', {
        status: testResponse.status,
        accessible: testResponse.ok
      })
    } catch (testError) {
      console.warn('⚠️ Could not test URL accessibility:', testError)
    }

    return publicUrl
  } catch (error) {
    console.error('💥 Error uploading image:', error)
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
    console.log('🚀 Initializing storage system...')
    
    // Create the images bucket
    await createBucketIfNotExists('images')
    
    // Test bucket accessibility
    try {
      console.log('🧪 Testing bucket accessibility...')
      const { data: testFiles, error: testError } = await supabase.storage
        .from('images')
        .list('', { limit: 1 })
      
      if (testError) {
        console.error('⚠️ Bucket test failed:', testError)
        console.log('💡 This might be due to RLS policies. Check your Supabase Storage policies.')
      } else {
        console.log('✅ Bucket is accessible')
      }
    } catch (testError) {
      console.error('⚠️ Could not test bucket:', testError)
    }
    
    console.log('✅ Storage initialization completed')
  } catch (error) {
    console.error('❌ Error initializing storage:', error)
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