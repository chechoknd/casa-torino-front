import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState, customersFeatureKey } from './customers.reducer';

export const selectCustomersState = createFeatureSelector<CustomerState>(customersFeatureKey);

export const selectAllCustomers = createSelector(selectCustomersState, (state) => state.customers);
export const selectActiveCustomers = createSelector(selectAllCustomers, (customers) =>
  customers.filter((customer) => customer.is_active)
);
export const selectCustomerEntities = createSelector(selectAllCustomers, (customers) =>
  customers.reduce<Record<string, (typeof customers)[number]>>((acc, customer) => {
    acc[customer.id] = customer;
    return acc;
  }, {})
);
export const selectCustomerById = (id: string) =>
  createSelector(selectCustomerEntities, (entities) => entities[id] ?? null);
export const selectSelectedCustomer = createSelector(selectCustomersState, (state) => state.selected);
export const selectCustomersLoading = createSelector(selectCustomersState, (state) => state.loading);

