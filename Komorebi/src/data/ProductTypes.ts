export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  condition?: string;
  description?: string;
  location?: string;
  availability?: string;
  seller_id?: string;
  image_url?: string;
  vendor?: string;
  created_at?: string;
  updated_at?: string;
}