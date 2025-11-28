import { supabase } from '../lib/supabaseClient'

/**
 * Test Supabase connection and storage access
 */
export const testSupabaseConnection = async (): Promise<void> => {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Auth session:', session ? 'Active' : 'No session')
    
    // Test storage access
    console.log('Testing storage access...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Storage access failed:', listError)
    } else {
      console.log('Storage accessible. Buckets:', buckets?.map(b => b.name) || [])
    }
    
    // Test database access
    console.log('Testing database access...')
    try {
      const { data: products, error: dbError } = await supabase
        .from('products')
        .select('id, name')
        .limit(1)
      
      if (dbError) {
        console.error('Database access failed:', dbError)
      } else {
        console.log('Database accessible. Products table exists.')
      }

      // Test categories table
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .limit(1)
      
      if (catError) {
        console.error('Categories table error:', catError)
      } else {
        console.log('Categories table accessible.')
      }

      // Test favorites table
      const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('id, user_id, product_id')
        .limit(1)
      
      if (favError) {
        console.error('Favorites table error:', favError)
      } else {
        console.log('Favorites table accessible.')
      }
    } catch (dbTestError) {
      console.error('Database test error:', dbTestError)
    }
    
  } catch (error) {
    console.error('Connection test failed:', error)
  }
}