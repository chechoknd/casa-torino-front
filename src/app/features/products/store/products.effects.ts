import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { NotifierService } from '../../../core/services/notifier.service';
import { ProductsService } from '../../../core/services/products.service';
import { productsActions } from './products.actions';

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);
  private readonly productsService = inject(ProductsService);
  private readonly notifier = inject(NotifierService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.loadProducts),
      mergeMap(() =>
        this.productsService.list().pipe(
          map((products) => productsActions.loadProductsSuccess({ products })),
          catchError(() => of(productsActions.loadProductsFailure({ error: 'No fue posible cargar productos.' })))
        )
      )
    )
  );

  detail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.loadProductDetail),
      mergeMap(({ id }) =>
        this.productsService.detail(id).pipe(
          map((product) => productsActions.loadProductDetailSuccess({ product })),
          catchError(() => of(productsActions.loadProductsFailure({ error: 'No fue posible cargar el producto.' })))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.createProduct),
      mergeMap(({ payload }) =>
        this.productsService.create(payload).pipe(
          map(() => productsActions.loadProducts()),
          tap(() => this.notifier.success('Producto creado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible crear el producto.');
            return of(productsActions.loadProductsFailure({ error: 'Error creando producto.' }));
          })
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.updateProduct),
      mergeMap(({ id, payload }) =>
        this.productsService.update(id, payload).pipe(
          map(() => productsActions.loadProducts()),
          tap(() => this.notifier.success('Producto actualizado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible actualizar el producto.');
            return of(productsActions.loadProductsFailure({ error: 'Error actualizando producto.' }));
          })
        )
      )
    )
  );

  deactivate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.deactivateProduct),
      mergeMap(({ id }) =>
        this.productsService.deactivate(id).pipe(
          map(() => productsActions.loadProducts()),
          tap(() => this.notifier.success('Producto desactivado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible desactivar el producto.');
            return of(productsActions.loadProductsFailure({ error: 'Error desactivando producto.' }));
          })
        )
      )
    )
  );
}

