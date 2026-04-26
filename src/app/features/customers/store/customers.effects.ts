import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { CustomersService } from '../../../core/services/customers.service';
import { NotifierService } from '../../../core/services/notifier.service';
import { customersActions } from './customers.actions';

@Injectable()
export class CustomersEffects {
  private readonly actions$ = inject(Actions);
  private readonly customersService = inject(CustomersService);
  private readonly notifier = inject(NotifierService);

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customersActions.loadCustomers),
      mergeMap(() =>
        this.customersService.list().pipe(
          map((customers) => customersActions.loadCustomersSuccess({ customers })),
          catchError(() =>
            of(customersActions.loadCustomersFailure({ error: 'No fue posible cargar clientes.' }))
          )
        )
      )
    )
  );

  loadCustomerDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customersActions.loadCustomerDetail),
      mergeMap(({ id }) =>
        this.customersService.detail(id).pipe(
          map((customer) => customersActions.loadCustomerDetailSuccess({ customer })),
          catchError(() =>
            of(customersActions.loadCustomersFailure({ error: 'No fue posible cargar el cliente.' }))
          )
        )
      )
    )
  );

  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customersActions.createCustomer),
      mergeMap(({ payload }) =>
        this.customersService.create(payload).pipe(
          map(() => customersActions.loadCustomers()),
          tap(() => this.notifier.success('Cliente creado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible crear el cliente.');
            return of(customersActions.loadCustomersFailure({ error: 'Error creando cliente.' }));
          })
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customersActions.updateCustomer),
      mergeMap(({ id, payload }) =>
        this.customersService.update(id, payload).pipe(
          map(() => customersActions.loadCustomers()),
          tap(() => this.notifier.success('Cliente actualizado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible actualizar el cliente.');
            return of(customersActions.loadCustomersFailure({ error: 'Error actualizando cliente.' }));
          })
        )
      )
    )
  );

  deactivateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customersActions.deactivateCustomer),
      mergeMap(({ id }) =>
        this.customersService.deactivate(id).pipe(
          map(() => customersActions.loadCustomers()),
          tap(() => this.notifier.success('Cliente desactivado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible desactivar el cliente.');
            return of(customersActions.loadCustomersFailure({ error: 'Error desactivando cliente.' }));
          })
        )
      )
    )
  );
}

