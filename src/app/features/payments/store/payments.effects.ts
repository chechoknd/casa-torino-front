import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { NotifierService } from '../../../core/services/notifier.service';
import { OrdersService } from '../../../core/services/orders.service';
import { PaymentsService } from '../../../core/services/payments.service';
import { paymentsActions } from './payments.actions';

@Injectable()
export class PaymentsEffects {
  private readonly actions$ = inject(Actions);
  private readonly paymentsService = inject(PaymentsService);
  private readonly ordersService = inject(OrdersService);
  private readonly notifier = inject(NotifierService);

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paymentsActions.loadPayments),
      mergeMap(() =>
        this.paymentsService.list().pipe(
          map((payments) => paymentsActions.loadPaymentsSuccess({ payments })),
          catchError(() => of(paymentsActions.loadPaymentsFailure({ error: 'No fue posible cargar pagos.' })))
        )
      )
    )
  );

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paymentsActions.loadPaymentsByOrder),
      mergeMap(({ orderId }) =>
        this.paymentsService.listByOrder(orderId).pipe(
          map((payments) => paymentsActions.loadPaymentsByOrderSuccess({ payments, orderId })),
          catchError(() => of(paymentsActions.loadPaymentsFailure({ error: 'No fue posible cargar pagos.' })))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paymentsActions.createPayment),
      mergeMap(({ payload }) =>
        this.ordersService.detail(payload.order_id).pipe(
          switchMap((order) => {
            if (payload.amount > order.total) {
              this.notifier.error(`El monto del pago (${payload.amount}) supera el total de la factura (${order.total}).`);
              return of(paymentsActions.loadPaymentsFailure({ error: 'El monto supera el total de la factura.' }));
            }
            return this.paymentsService.create(payload).pipe(
              map(() => paymentsActions.loadPayments()),
              tap(() => this.notifier.success('Pago registrado correctamente.')),
              catchError(() => {
                this.notifier.error('No fue posible registrar el pago.');
                return of(paymentsActions.loadPaymentsFailure({ error: 'Error creando pago.' }));
              })
            );
          }),
          catchError(() => {
            this.notifier.error('No fue posible validar la orden asociada al pago.');
            return of(paymentsActions.loadPaymentsFailure({ error: 'Error validando orden.' }));
          })
        )
      )
    )
  );
}
