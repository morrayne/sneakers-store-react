export type Theme = "light" | "dark" | "system";

// ─── Product ───────────────────────────────────────────────

export interface ProductColor {
  name: string;
  color: string;
  folder_name: string;
}

export interface Product {
  id: number
  name: string
  brand: string
  category: 'men' | 'women' | 'unisex'
  price: number
  old_price: number | null     
  rating: number
  colors: ProductColor[]
  is_featured: boolean
  images: string[] | null
  created_at: string
}

// ─── Cart ──────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  name: string;
  brand: string;
  price: number;
  image: string | null;
  color: ProductColor;
  size: string;
  quantity: number;
}

// ─── Orders ────────────────────────────────────────────────

export type OrderStatus = "pending" | "processing" | "done";

export interface Order {
  id: number;
  user_id: string;
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  size: string;
  color: string | null;
  price: number;
  quantity: number;
}
