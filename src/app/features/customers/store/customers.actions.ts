import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer } from '../../../core/models/customer.model';

export const customersActions = createActionGroup({
  source: 'Customers',
  events: {
    'Load Customers': emptyProps(),
    'Load Customers Success': props<{ customers: Customer[] }>(),
    'Load Customers Failure': props<{ error: string }>(),
    'Load Customer Detail': props<{ id: string }>(),
    'Load Customer Detail Success': props<{ customer: Customer }>(),
    'Create Customer': props<{ payload: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'is_active'> }>(),
    'Update Customer': props<{ id: string; payload: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>> }>(),
    'Deactivate Customer': props<{ id: string }>()
  }
});

