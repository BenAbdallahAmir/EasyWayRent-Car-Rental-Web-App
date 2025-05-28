export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: 'admin' | 'client';
  created_at?: string;
  updated_at?: string;
}
