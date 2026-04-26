import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Recipe, RecipeCost, RecipeDetail, RecipeItem } from '../models/recipe.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class RecipesService extends ApiBaseService {
  list(products: Array<{ id: string }>): Observable<RecipeDetail[]> {
    if (!products.length) {
      return of([]);
    }

    return forkJoin(products.map((product) => this.detailByProduct(product.id))).pipe(
      map((recipes) => recipes.filter((recipe): recipe is RecipeDetail => Boolean(recipe)))
    );
  }

  create(payload: Omit<Recipe, 'id'>): Observable<Recipe> {
    return this.post<Recipe>('/recipes', payload);
  }

  addItem(id: string, payload: RecipeItem): Observable<RecipeItem> {
    return this.post<RecipeItem>(`/recipes/${id}/items`, payload);
  }

  detailByProduct(productId: string): Observable<RecipeDetail> {
    return this.get<RecipeDetail>(`/recipes/product/${productId}`).pipe(
      switchMap((recipe) =>
        this.get<RecipeCost>(`/recipes/${recipe.id}/cost`).pipe(
          map((cost) => ({ ...recipe, cost: cost.total_cost }))
        )
      )
    );
  }

  cost(id: string): Observable<RecipeCost> {
    return this.get<RecipeCost>(`/recipes/${id}/cost`);
  }
}
