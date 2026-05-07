import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Payment } from '../models/payment.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class PaymentsService extends ApiBaseService {
  list(): Observable<Payment[]> {
    return this.get<Payment[]>('/payments');
  }

  create(payload: Omit<Payment, 'id' | 'created_at'>): Observable<Payment> {
    return this.post<Payment>('/payments', {
      ...payload,
      amount: this.decimal(payload.amount)
    });
  }

  listByOrder(orderId: string): Observable<Payment[]> {
    return this.get<Payment[]>('/payments').pipe(
      map((payments) => payments.filter((payment) => payment.order_id === orderId))
    );
  }
}
