import { createReducer, on } from '@ngrx/store';
import { Payment } from '../../../core/models/payment.model';
import { paymentsActions } from './payments.actions';

export interface PaymentState {
  payments: Payment[];
  selectedOrderId: string | null;
  loading: boolean;
  error: string | null;
}

export const paymentsFeatureKey = 'payments';

export const initialPaymentState: PaymentState = {
  payments: [],
  selectedOrderId: null,
  loading: false,
  error: null
};

export const paymentsReducer = createReducer(
  initialPaymentState,
  on(paymentsActions.resetPayments, () => initialPaymentState),
  on(paymentsActions.loadPaymentsByOrder, paymentsActions.createPayment, paymentsActions.updatePaymentStatus, (state, action) => ({
    ...state,
    selectedOrderId: 'orderId' in action ? action.orderId : state.selectedOrderId,
    loading: true,
    error: null
  })),
  on(paymentsActions.loadPaymentsByOrderSuccess, (state, { payments, orderId }) => ({
    ...state,
    payments,
    selectedOrderId: orderId,
    loading: false
  })),
  on(paymentsActions.loadPaymentsFailure, (state, { error }) => ({ ...state, error, loading: false }))
);

