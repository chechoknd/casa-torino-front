import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, defaultIfEmpty, from, last, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { RecipesService } from '../../../core/services/recipes.service';
import { NotifierService } from '../../../core/services/notifier.service';
import { recipesActions } from './recipes.actions';

@Injectable()
export class RecipesEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly recipesService = inject(RecipesService);
  private readonly notifier = inject(NotifierService);

  private getErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    const detail = error.error?.detail;

    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }

    if (Array.isArray(detail) && detail.length) {
      return detail
        .map((item: unknown) => {
          if (typeof item === 'string') {
            return item;
          }

          if (item && typeof item === 'object' && 'msg' in item) {
            return String((item as { msg: unknown }).msg);
          }

          return '';
        })
        .filter(Boolean)
        .join(' | ') || fallback;
    }

    if (typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    if (typeof error.error?.error === 'string' && error.error.error.trim()) {
      return error.error.error;
    }

    return fallback;
  }

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recipesActions.loadRecipes),
      switchMap(() =>
        this.recipesService.list().pipe(
          map((recipes) => recipesActions.loadRecipesSuccess({ recipes })),
          catchError((error: unknown) =>
            of(
              recipesActions.loadRecipesFailure({
                error: this.getErrorMessage(error, 'No fue posible cargar recetas.')
              })
            )
          )
        )
      )
    )
  );

  detail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recipesActions.loadRecipeDetail),
      mergeMap(({ productId }) =>
        this.recipesService.detailByProduct(productId).pipe(
          map((recipe) => recipesActions.loadRecipeDetailSuccess({ recipe })),
          catchError((error: unknown) =>
            of(
              recipesActions.loadRecipesFailure({
                error: this.getErrorMessage(error, 'No fue posible cargar la receta.')
              })
            )
          )
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recipesActions.createRecipe),
      mergeMap(({ payload }) =>
        this.recipesService.create({
          name: payload.name,
          product_id: payload.product_id,
          servings: payload.servings
        }).pipe(
          switchMap((recipe) =>
            from(payload.items).pipe(
              concatMap((item) => this.recipesService.addItem(recipe.id, item)),
              last(),
              defaultIfEmpty(recipe),
              map(() => recipesActions.createRecipeSuccess({ recipe }))
            )
          ),
          catchError((error: unknown) => {
            const message = this.getErrorMessage(error, 'No fue posible crear la receta.');
            this.notifier.error(message);
            return of(recipesActions.loadRecipesFailure({ error: message }));
          })
        )
      )
    )
  );

  createSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recipesActions.createRecipeSuccess),
      tap(() => {
        this.notifier.success('Receta creada correctamente.');
        this.router.navigate(['/recipes']);
      }),
      map(() => recipesActions.loadRecipes())
    )
  );
}
