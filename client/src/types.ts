export interface OrderItem {
  name: string;
  quantity: number;
  special_instructions?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer_name?: string;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  created_at: number;
  updated_at: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customer_name?: string;
  notes?: string;
}
