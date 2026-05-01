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
  customer_name?: string;
  order_number?: number | string;
  order_label?: string;
  status: OrderStatus;
  items?: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  created_at: string;
  updated_at?: string;
}

export interface OrderItemPayload {
  product_id: string;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price?: number;
  subtotal?: number;
  total?: number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  status_history?: Array<{
    status: OrderStatus;
    changed_at: string;
  }>;
}
