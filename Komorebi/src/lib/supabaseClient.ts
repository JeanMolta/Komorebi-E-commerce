
import { createClient } from '@supabase/supabase-js'

// 🔐 Variables del entorno (desde archivo .env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Validación por si no cargan las variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ ERROR: No se encontraron variables .env de Supabase")
}

// 🌐 Cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


export interface Cart {
  id: string
  created_at: string
  user_id: string
  product_id: string
  quantity: number
  updated_at: string
}

export interface Categories {
  id: string
  name: string
  slug: string
  created_at: string
  description: string
  image_url: string
}

export interface Comments {
  id: string
  created_at: string
  product_id: string
  user_id: string
  content: string
  updated_at: string
}

export interface Favorites {
  id: string
  created_at: string
  user_id: string
  product_id: string
}

export interface Items_Order {
  id: string
  product_id: string
  seller_id: string
  quantity: number
  unit_price: number
  total_price: number
  item_state: string
}

export interface Notifications {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  aditional_data: string
}

export interface Orders {
  id: string
  total: number
  shipping_location: string
  payment_method: string
  notes: string
  updated_at: string
}

export interface Products {
  id: string
  stock: number
  active: boolean
  weight_grams: number
  dimensions: string
  tags: string
  updated_at: string
}

export interface Profiles {
  id: string
  location: string
  description: string
  avatar_url: string
  user_type: string
  created_at: string
  updated_at: string
}

export interface Reviews {
  id: string
  user_id: string
  calification: number
  title: string
  comment: string
  verify: boolean
  updated_at: string
}

