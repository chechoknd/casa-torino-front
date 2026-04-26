export type Unit = 'G' | 'ML' | 'UNIT' | 'KG' | 'L';

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
  average_cost: number;
  stock: number;
  minimum_stock: number;
  is_active: boolean;
}

