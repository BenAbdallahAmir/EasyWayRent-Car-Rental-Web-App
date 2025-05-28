export interface Car {
  id: number;
  category_id?: number;
  category?: Category;
  category_name?: string;
  model: string;
  brand: string;
  doors: number;
  luggage: number;
  passengers: number;
  year: number;
  status: string;
  price_per_day: number;
  image?: string;
  license_plate: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  cars_count?: number;
  created_at?: string;
  updated_at?: string;
}
