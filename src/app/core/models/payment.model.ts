export type PaymentMethod = 'CASH' | 'TRANSFER' | 'NEQUI' | 'DAVIPLATA' | 'CARD' | 'OTHER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  created_at: string;
}

