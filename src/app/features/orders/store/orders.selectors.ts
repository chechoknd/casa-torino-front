import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState, ordersFeatureKey } from './orders.reducer';

export const selectOrdersState = createFeatureSelector<OrderState>(ordersFeatureKey);
export const selectAllOrders = createSelector(selectOrdersState, (state) => state.orders);
export const selectSelectedOrder = createSelector(selectOrdersState, (state) => state.selected);
export const selectPendingOrdersToday = createSelector(selectAllOrders, (orders) => {
  const today = new Date().toDateString();
  return orders.filter((order) =>
    ['PENDING', 'CONFIRMED', 'IN_PREPARATION'].includes(order.status) &&
    new Date(order.created_at).toDateString() === today
  );
});
export const selectLatestOrders = createSelector(selectAllOrders, (orders) =>
  [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
);

