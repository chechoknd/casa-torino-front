import { createReducer, on } from '@ngrx/store';
import { Customer } from '../../../core/models/customer.model';
import { customersActions } from './customers.actions';

export interface CustomerState {
  customers: Customer[];
  selected: Customer | null;
  loading: boolean;
  error: string | null;
}

export const initialCustomerState: CustomerState = {
  customers: [],
  selected: null,
  loading: false,
  error: null
};

export const customersFeatureKey = 'customers';

export const customersReducer = createReducer(
  initialCustomerState,
  on(
    customersActions.loadCustomers,
    customersActions.loadCustomerDetail,
    customersActions.createCustomer,
    customersActions.updateCustomer,
    customersActions.deactivateCustomer,
    (state) => ({ ...state, loading: true, error: null })
  ),
  on(customersActions.loadCustomersSuccess, (state, { customers }) => ({
    ...state,
    customers,
    loading: false
  })),
  on(customersActions.loadCustomerDetailSuccess, (state, { customer }) => ({
    ...state,
    selected: customer,
    loading: false
  })),
  on(customersActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

