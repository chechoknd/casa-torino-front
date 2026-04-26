import { createReducer, on } from '@ngrx/store';
import { Order, OrderDetail } from '../../../core/models/order.model';
import { ordersActions } from './orders.actions';

export interface OrderState {
  orders: Order[];
  selected: OrderDetail | null;
  loading: boolean;
  error: string | null;
}

export const ordersFeatureKey = 'orders';

export const initialOrderState: OrderState = {
  orders: [],
  selected: null,
  loading: false,
  error: null
};

export const ordersReducer = createReducer(
  initialOrderState,
  on(
    ordersActions.loadOrders,
    ordersActions.loadOrderDetail,
    ordersActions.createOrder,
    ordersActions.updateOrderStatus,
    (state) => ({ ...state, loading: true, error: null })
  ),
  on(ordersActions.loadOrdersSuccess, (state, { orders }) => ({ ...state, orders, loading: false })),
  on(ordersActions.loadOrderDetailSuccess, (state, { order }) => ({ ...state, selected: order, loading: false })),
  on(ordersActions.loadOrdersFailure, (state, { error }) => ({ ...state, error, loading: false }))
);

