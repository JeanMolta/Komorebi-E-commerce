import { supabase } from '../lib/supabaseClient'

// Default categories that match the form options
export const DEFAULT_CATEGORIES = [
  { name: 'Healthy', slug: 'healthy', description: 'Healthy food options' },
  { name: 'Cakes', slug: 'cakes', description: 'Delicious cakes and pastries' },
  { name: 'Shakes', slug: 'shakes', description: 'Refreshing shakes and smoothies' },
  { name: 'Sweet Treats', slug: 'sweet-treats', description: 'Sweet treats and desserts' },
  { name: 'Donuts', slug: 'donuts', description: 'Fresh donuts and glazed treats' },
  { name: 'Onigiris', slug: 'onigiris', description: 'Japanese rice balls' },
  { name: 'Other', slug: 'other', description: 'Other food items' }
]

/**
 * Initialize default categories in the database
 */
export const initializeCategories = async (): Promise<void> => {
  try {
    for (const category of DEFAULT_CATEGORIES) {
      // Check if category already exists
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category.slug)
        .single()

      if (!existing) {
        // Create category if it doesn't exist
        const { error } = await supabase
          .from('categories')
          .insert({
            name: category.name,
            slug: category.slug,
            description: category.description,
            created_at: new Date().toISOString()
          })

        if (error) {
          console.error(`Error creating category ${category.name}:`, error)
        } else {
          console.log(`Category ${category.name} created successfully`)
        }
      }
    }
  } catch (error) {
    console.error('Error initializing categories:', error)
  }
}

/**
 * Get all categories from the database
 */
export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}