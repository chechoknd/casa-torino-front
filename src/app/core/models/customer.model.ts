export type CustomerType = 'PERSON' | 'COMPANY';

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  customer_type: CustomerType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

