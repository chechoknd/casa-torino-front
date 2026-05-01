export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PREPARATION'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  customer_id: string;
  order_number?: number | string;
  consecutive?: number | string;
  sequence?: number | string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  created_at: string;
  items?: Array<{
    id?: string;
    product_id: string;
    product_name?: string;
    quantity: number;
    unit_price?: number;
    total?: number;
  }>;
}

export interface OrderItemPayload {
  product_id: string;
  quantity: number;
}

export interface OrderDetail extends Order {
  customer_name?: string;
  items: NonNullable<Order['items']>;
  status_history?: Array<{
    status: OrderStatus;
    changed_at: string;
  }>;
}
