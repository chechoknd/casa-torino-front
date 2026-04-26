import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { IngredientsService } from '../../../core/services/ingredients.service';
import { NotifierService } from '../../../core/services/notifier.service';
import { ingredientsActions } from './ingredients.actions';

@Injectable()
export class IngredientsEffects {
  private readonly actions$ = inject(Actions);
  private readonly ingredientsService = inject(IngredientsService);
  private readonly notifier = inject(NotifierService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ingredientsActions.loadIngredients),
      mergeMap(() =>
        this.ingredientsService.list().pipe(
          map((ingredients) => ingredientsActions.loadIngredientsSuccess({ ingredients })),
          catchError(() =>
            of(ingredientsActions.loadIngredientsFailure({ error: 'No fue posible cargar ingredientes.' }))
          )
        )
      )
    )
  );

  detail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ingredientsActions.loadIngredientDetail),
      mergeMap(({ id }) =>
        this.ingredientsService.detail(id).pipe(
          map((ingredient) => ingredientsActions.loadIngredientDetailSuccess({ ingredient })),
          catchError(() =>
            of(ingredientsActions.loadIngredientsFailure({ error: 'No fue posible cargar el ingrediente.' }))
          )
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ingredientsActions.createIngredient),
      mergeMap(({ payload }) =>
        this.ingredientsService.create(payload).pipe(
          map(() => ingredientsActions.loadIngredients()),
          tap(() => this.notifier.success('Ingrediente creado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible crear el ingrediente.');
            return of(ingredientsActions.loadIngredientsFailure({ error: 'Error creando ingrediente.' }));
          })
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ingredientsActions.updateIngredient),
      mergeMap(({ id, payload }) =>
        this.ingredientsService.update(id, payload).pipe(
          map(() => ingredientsActions.loadIngredients()),
          tap(() => this.notifier.success('Ingrediente actualizado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible actualizar el ingrediente.');
            return of(ingredientsActions.loadIngredientsFailure({ error: 'Error actualizando ingrediente.' }));
          })
        )
      )
    )
  );

  deactivate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ingredientsActions.deactivateIngredient),
      mergeMap(({ id }) =>
        this.ingredientsService.deactivate(id).pipe(
          map(() => ingredientsActions.loadIngredients()),
          tap(() => this.notifier.success('Ingrediente desactivado correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible desactivar el ingrediente.');
            return of(ingredientsActions.loadIngredientsFailure({ error: 'Error desactivando ingrediente.' }));
          })
        )
      )
    )
  );
}

