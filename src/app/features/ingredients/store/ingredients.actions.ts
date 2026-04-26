import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Ingredient } from '../../../core/models/ingredient.model';

export const ingredientsActions = createActionGroup({
  source: 'Ingredients',
  events: {
    'Load Ingredients': emptyProps(),
    'Load Ingredients Success': props<{ ingredients: Ingredient[] }>(),
    'Load Ingredients Failure': props<{ error: string }>(),
    'Load Ingredient Detail': props<{ id: string }>(),
    'Load Ingredient Detail Success': props<{ ingredient: Ingredient }>(),
    'Create Ingredient': props<{ payload: Omit<Ingredient, 'id' | 'is_active'> }>(),
    'Update Ingredient': props<{ id: string; payload: Partial<Omit<Ingredient, 'id'>> }>(),
    'Deactivate Ingredient': props<{ id: string }>()
  }
});

