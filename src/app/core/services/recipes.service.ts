import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Recipe, RecipeCost, RecipeDetail, RecipeItem } from '../models/recipe.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class RecipesService extends ApiBaseService {
  list(): Observable<RecipeDetail[]> {
    return this.get<RecipeDetail[]>('/recipes');
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
    return this.get<RecipeDetail[]>('/recipes').pipe(
      map((recipes) => {
        const recipe = recipes.find((item) => item.product_id === productId || item.id === productId);

        if (!recipe) {
          throw new Error('Recipe not found');
        }

        return recipe;
      })
    );
  }

  cost(id: string): Observable<RecipeCost> {
    return this.get<RecipeCost>(`/recipes/${id}/cost`);
  }
}
