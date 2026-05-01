import { Unit } from './ingredient.model';

export interface Recipe {
  id: string;
  name: string;
  product_id: string;
  product_name?: string;
  portions?: number;
  servings: number;
  created_at?: string;
  updated_at?: string;
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
  cost?: number;
}
