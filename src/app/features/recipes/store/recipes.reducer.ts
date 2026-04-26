import { createReducer, on } from '@ngrx/store';
import { RecipeDetail } from '../../../core/models/recipe.model';
import { recipesActions } from './recipes.actions';

export interface RecipeState {
  recipes: RecipeDetail[];
  selected: RecipeDetail | null;
  loading: boolean;
  error: string | null;
}

export const recipesFeatureKey = 'recipes';

export const initialRecipeState: RecipeState = {
  recipes: [],
  selected: null,
  loading: false,
  error: null
};

export const recipesReducer = createReducer(
  initialRecipeState,
  on(recipesActions.loadRecipes, recipesActions.loadRecipeDetail, recipesActions.createRecipe, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(recipesActions.loadRecipesSuccess, (state, { recipes }) => ({ ...state, recipes, loading: false })),
  on(recipesActions.loadRecipeDetailSuccess, (state, { recipe }) => ({ ...state, selected: recipe, loading: false })),
  on(recipesActions.loadRecipesFailure, (state, { error }) => ({ ...state, error, loading: false }))
);

