import { createReducer, on } from '@ngrx/store';
import { Ingredient } from '../../../core/models/ingredient.model';
import { ingredientsActions } from './ingredients.actions';

export interface IngredientState {
  ingredients: Ingredient[];
  selected: Ingredient | null;
  loading: boolean;
  error: string | null;
}

export const ingredientsFeatureKey = 'ingredients';

export const initialIngredientState: IngredientState = {
  ingredients: [],
  selected: null,
  loading: false,
  error: null
};

export const ingredientsReducer = createReducer(
  initialIngredientState,
  on(
    ingredientsActions.loadIngredients,
    ingredientsActions.loadIngredientDetail,
    ingredientsActions.createIngredient,
    ingredientsActions.updateIngredient,
    ingredientsActions.deactivateIngredient,
    (state) => ({ ...state, loading: true, error: null })
  ),
  on(ingredientsActions.loadIngredientsSuccess, (state, { ingredients }) => ({ ...state, ingredients, loading: false })),
  on(ingredientsActions.loadIngredientDetailSuccess, (state, { ingredient }) => ({ ...state, selected: ingredient, loading: false })),
  on(ingredientsActions.loadIngredientsFailure, (state, { error }) => ({ ...state, error, loading: false }))
);

