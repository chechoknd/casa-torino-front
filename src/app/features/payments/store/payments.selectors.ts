import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaymentState, paymentsFeatureKey } from './payments.reducer';

export const selectPaymentsState = createFeatureSelector<PaymentState>(paymentsFeatureKey);
export const selectAllPayments = createSelector(selectPaymentsState, (state) => state.payments);
export const selectSelectedPaymentOrderId = createSelector(selectPaymentsState, (state) => state.selectedOrderId);

