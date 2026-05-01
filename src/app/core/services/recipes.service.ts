import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Recipe, RecipeCost, RecipeDetail, RecipeItem } from '../models/recipe.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class RecipesService extends ApiBaseService {
  list(products: Array<{ id: string; name?: string }>): Observable<RecipeDetail[]> {
    if (!products.length) {
      return of([]);
    }

    return forkJoin(
      products.map((product) =>
        this.detailByProduct(product.id).pipe(
          map((recipe): RecipeDetail => product.name ? { ...recipe, product_name: recipe.product_name ?? product.name } : recipe),
          catchError(() => of(null))
        )
      )
    ).pipe(
      map((recipes) => recipes.filter((recipe): recipe is RecipeDetail => recipe !== null))
    );
  }

  create(payload: Omit<Recipe, 'id'>): Observable<Recipe> {
    return this.post<Recipe>('/recipes', {
      product_id: payload.product_id,
      name: payload.name,
      portions: payload.servings
    });
  }

  addItem(id: string, payload: RecipeItem): Observable<RecipeItem> {
    return this.post<RecipeItem>(`/recipes/${id}/items`, {
      ingredient_id: payload.ingredient_id,
      quantity: this.decimal(payload.quantity),
      unit: payload.unit
    });
  }

  detailByProduct(productId: string): Observable<RecipeDetail> {
    return this.get<RecipeDetail>(`/recipes/product/${productId}`).pipe(
      switchMap((recipe) =>
        this.get<RecipeCost>(`/recipes/${recipe.id}/cost`).pipe(
          map((cost) => ({ ...recipe, cost: cost.total_cost })),
          catchError(() => of({ ...recipe }))
        )
      )
    );
  }

  cost(id: string): Observable<RecipeCost> {
    return this.get<RecipeCost>(`/recipes/${id}/cost`);
  }
}
