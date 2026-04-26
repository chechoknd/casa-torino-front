import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { NotifierService } from '../../../core/services/notifier.service';
import { PaymentsService } from '../../../core/services/payments.service';
import { paymentsActions } from './payments.actions';

@Injectable()
export class PaymentsEffects {
  private readonly actions$ = inject(Actions);
  private readonly paymentsService = inject(PaymentsService);
  private readonly notifier = inject(NotifierService);

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
        this.paymentsService.create(payload).pipe(
          map(() => paymentsActions.loadPaymentsByOrder({ orderId: payload.order_id })),
          tap(() => this.notifier.success('Pago registrado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible registrar el pago.');
            return of(paymentsActions.loadPaymentsFailure({ error: 'Error creando pago.' }));
          })
        )
      )
    )
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paymentsActions.updatePaymentStatus),
      mergeMap(({ id, orderId, status }) =>
        this.paymentsService.updateStatus(id, status).pipe(
          map(() => paymentsActions.loadPaymentsByOrder({ orderId })),
          tap(() => this.notifier.success('Estado del pago actualizado.')),
          catchError(() => {
            this.notifier.error('No fue posible actualizar el pago.');
            return of(paymentsActions.loadPaymentsFailure({ error: 'Error actualizando pago.' }));
          })
        )
      )
    )
  );
}

