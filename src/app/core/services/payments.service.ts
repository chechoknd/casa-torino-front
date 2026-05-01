import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment, PaymentStatus } from '../models/payment.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class PaymentsService extends ApiBaseService {
  create(payload: Omit<Payment, 'id' | 'created_at'>): Observable<Payment> {
    return this.post<Payment>('/payments', {
      ...payload,
      amount: this.decimal(payload.amount)
    });
  }

  listByOrder(orderId: string): Observable<Payment[]> {
    return this.get<Payment[]>(`/orders/${orderId}/payments`);
  }

  updateStatus(id: string, status: PaymentStatus): Observable<Payment> {
    return this.patch<Payment>(`/payments/${id}/status`, { status });
  }
}
