import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, defaultIfEmpty, from, last, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { NotifierService } from '../../../core/services/notifier.service';
import { OrdersService } from '../../../core/services/orders.service';
import { ordersActions } from './orders.actions';

@Injectable()
export class OrdersEffects {
  private readonly actions$ = inject(Actions);
  private readonly ordersService = inject(OrdersService);
  private readonly notifier = inject(NotifierService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ordersActions.loadOrders),
      mergeMap(() =>
        this.ordersService.list().pipe(
          map((orders) => ordersActions.loadOrdersSuccess({ orders })),
          catchError(() => of(ordersActions.loadOrdersFailure({ error: 'No fue posible cargar pedidos.' })))
        )
      )
    )
  );

  detail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ordersActions.loadOrderDetail),
      mergeMap(({ id }) =>
        this.ordersService.detail(id).pipe(
          map((order) => ordersActions.loadOrderDetailSuccess({ order })),
          catchError(() => of(ordersActions.loadOrdersFailure({ error: 'No fue posible cargar el pedido.' })))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ordersActions.createOrder),
      mergeMap(({ payload }) =>
        this.ordersService.create({ customer_id: payload.customer_id, discount: payload.discount }).pipe(
          switchMap((order) =>
            from(payload.items).pipe(
              concatMap((item) => this.ordersService.addItem(order.id, item)),
              last(),
              defaultIfEmpty(order),
              map(() => ordersActions.loadOrders())
            )
          ),
          tap(() => this.notifier.success('Pedido creado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible crear el pedido.');
            return of(ordersActions.loadOrdersFailure({ error: 'Error creando pedido.' }));
          })
        )
      )
    )
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ordersActions.updateOrderStatus),
      mergeMap(({ id, status }) =>
        this.ordersService.updateStatus(id, status).pipe(
          map(() => ordersActions.loadOrders()),
          tap(() => this.notifier.success('Estado del pedido actualizado.')),
          catchError(() => {
            this.notifier.error('No fue posible actualizar el estado.');
            return of(ordersActions.loadOrdersFailure({ error: 'Error actualizando pedido.' }));
          })
        )
      )
    )
  );
}

