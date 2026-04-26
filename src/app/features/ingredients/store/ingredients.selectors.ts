import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IngredientState, ingredientsFeatureKey } from './ingredients.reducer';

export const selectIngredientsState = createFeatureSelector<IngredientState>(ingredientsFeatureKey);
export const selectAllIngredients = createSelector(selectIngredientsState, (state) => state.ingredients);
export const selectActiveIngredients = createSelector(selectAllIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.is_active)
);
export const selectLowStockIngredients = createSelector(selectActiveIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.stock <= ingredient.minimum_stock)
);
export const selectIngredientById = (id: string) =>
  createSelector(selectAllIngredients, (ingredients) => ingredients.find((ingredient) => ingredient.id === id) ?? null);
export const selectSelectedIngredient = createSelector(selectIngredientsState, (state) => state.selected);

