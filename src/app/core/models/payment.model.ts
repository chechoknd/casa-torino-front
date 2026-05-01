export type PaymentMethod = 'CASH' | 'TRANSFER' | 'NEQUI' | 'DAVIPLATA' | 'CARD' | 'OTHER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  order_id: string;
  order_number?: number | string;
  order_label?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  products?: Array<{
    product_id: string;
    product_name?: string;
    quantity: number;
  }>;
  created_at: string;
  updated_at?: string;
}
