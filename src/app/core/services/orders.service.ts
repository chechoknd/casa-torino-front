import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderDetail, OrderItemPayload, OrderStatus } from '../models/order.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class OrdersService extends ApiBaseService {
  list(): Observable<Order[]> {
    return this.get<Order[]>('/orders');
  }

  detail(id: string): Observable<OrderDetail> {
    return this.get<OrderDetail>(`/orders/${id}`);
  }

  create(payload: { customer_id: string; discount?: number }): Observable<Order> {
    return this.post<Order>('/orders', payload);
  }

  addItem(orderId: string, payload: OrderItemPayload): Observable<OrderDetail> {
    return this.post<OrderDetail>(`/orders/${orderId}/items`, payload);
  }

  updateStatus(id: string, status: OrderStatus): Observable<OrderDetail> {
    return this.patch<OrderDetail>(`/orders/${id}/status`, { status });
  }
}

