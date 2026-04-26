import { Unit } from './ingredient.model';

export interface Recipe {
  id: string;
  name: string;
  product_id: string;
  servings: number;
  is_active?: boolean;
}

export interface RecipeItem {
  id?: string;
  recipe_id?: string;
  ingredient_id: string;
  quantity: number;
  unit: Unit;
}

export interface RecipeCost {
  recipe_id: string;
  total_cost: number;
}

export interface RecipeDetail extends Recipe {
  items: RecipeItem[];
  product_name?: string;
  cost?: number;
}

