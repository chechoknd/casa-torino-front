import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Recipe, RecipeDetail, RecipeItem } from '../../../core/models/recipe.model';

export const recipesActions = createActionGroup({
  source: 'Recipes',
  events: {
    'Load Recipes': emptyProps(),
    'Load Recipes Success': props<{ recipes: RecipeDetail[] }>(),
    'Load Recipes Failure': props<{ error: string }>(),
    'Load Recipe Detail': props<{ productId: string }>(),
    'Load Recipe Detail Success': props<{ recipe: RecipeDetail }>(),
    'Create Recipe': props<{ payload: { name: string; product_id: string; servings: number; items: RecipeItem[] } }>(),
    'Create Recipe Success': props<{ recipe: Recipe }>()
  }
});
