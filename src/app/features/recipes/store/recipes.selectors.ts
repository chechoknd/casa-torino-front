import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RecipeState, recipesFeatureKey } from './recipes.reducer';

export const selectRecipesState = createFeatureSelector<RecipeState>(recipesFeatureKey);
export const selectAllRecipes = createSelector(selectRecipesState, (state) => state.recipes);
export const selectSelectedRecipe = createSelector(selectRecipesState, (state) => state.selected);
export const selectRecipeByProductId = (productId: string) =>
  createSelector(selectAllRecipes, (recipes) => recipes.find((recipe) => recipe.product_id === productId) ?? null);

