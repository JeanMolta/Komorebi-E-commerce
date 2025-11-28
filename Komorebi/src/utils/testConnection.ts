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
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('count()')
      .limit(1)
    
    if (dbError) {
      console.error('Database access failed:', dbError)
    } else {
      console.log('Database accessible')
    }
    
  } catch (error) {
    console.error('Connection test failed:', error)
  }
}