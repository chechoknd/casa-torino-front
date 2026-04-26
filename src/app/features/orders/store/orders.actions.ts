import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Order, OrderDetail, OrderItemPayload, OrderStatus } from '../../../core/models/order.model';

export const ordersActions = createActionGroup({
  source: 'Orders',
  events: {
    'Load Orders': emptyProps(),
    'Load Orders Success': props<{ orders: Order[] }>(),
    'Load Orders Failure': props<{ error: string }>(),
    'Load Order Detail': props<{ id: string }>(),
    'Load Order Detail Success': props<{ order: OrderDetail }>(),
    'Create Order': props<{ payload: { customer_id: string; discount?: number; items: OrderItemPayload[] } }>(),
    'Update Order Status': props<{ id: string; status: OrderStatus }>()
  }
});

