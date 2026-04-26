import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, defaultIfEmpty, from, last, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ProductsService } from '../../../core/services/products.service';
import { RecipesService } from '../../../core/services/recipes.service';
import { NotifierService } from '../../../core/services/notifier.service';
import { recipesActions } from './recipes.actions';

@Injectable()
export class RecipesEffects {
  private readonly actions$ = inject(Actions);
  private readonly productsService = inject(ProductsService);
  private readonly recipesService = inject(RecipesService);
  private readonly notifier = inject(NotifierService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recipesActions.loadRecipes),
      switchMap(() =>
        this.productsService.list().pipe(
          switchMap((products) => this.recipesService.list(products)),
          map((recipes) => recipesActions.loadRecipesSuccess({ recipes })),
          catchError(() => of(recipesActions.loadRecipesFailure({ error: 'No fue posible cargar recetas.' })))
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
          catchError(() => of(recipesActions.loadRecipesFailure({ error: 'No fue posible cargar la receta.' })))
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
              map(() => recipesActions.loadRecipes())
            )
          ),
          tap(() => this.notifier.success('Receta creada correctamente.')),
          catchError(() => {
            this.notifier.error('No fue posible crear la receta.');
            return of(recipesActions.loadRecipesFailure({ error: 'Error creando receta.' }));
          })
        )
      )
    )
  );
}

