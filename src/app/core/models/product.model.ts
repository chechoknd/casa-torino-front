export type ProductType =
  | 'LUNCH'
  | 'JUICE'
  | 'CAKE'
  | 'EVENT'
  | 'PLAN'
  | 'VACUUM_PACKED';

export interface Product {
  id: string;
  name: string;
  description: string;
  product_type: ProductType;
  base_price: number;
  cost_price: number;
  is_active: boolean;
}

