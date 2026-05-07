import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Payment } from '../../../core/models/payment.model';

export const paymentsActions = createActionGroup({
  source: 'Payments',
  events: {
    'Reset Payments': emptyProps(),
    'Load Payments': emptyProps(),
    'Load Payments Success': props<{ payments: Payment[] }>(),
    'Load Payments By Order': props<{ orderId: string }>(),
    'Load Payments By Order Success': props<{ payments: Payment[]; orderId: string }>(),
    'Load Payments Failure': props<{ error: string }>(),
    'Create Payment': props<{ payload: Omit<Payment, 'id' | 'created_at'> }>()
  }
});
