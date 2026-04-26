import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Payment, PaymentStatus } from '../../../core/models/payment.model';

export const paymentsActions = createActionGroup({
  source: 'Payments',
  events: {
    'Reset Payments': emptyProps(),
    'Load Payments By Order': props<{ orderId: string }>(),
    'Load Payments By Order Success': props<{ payments: Payment[]; orderId: string }>(),
    'Load Payments Failure': props<{ error: string }>(),
    'Create Payment': props<{ payload: Omit<Payment, 'id' | 'created_at'> }>(),
    'Update Payment Status': props<{ id: string; orderId: string; status: PaymentStatus }>()
  }
});

