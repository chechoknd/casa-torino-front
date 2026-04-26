import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '../../../core/models/product.model';

export const productsActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),
    'Load Product Detail': props<{ id: string }>(),
    'Load Product Detail Success': props<{ product: Product }>(),
    'Create Product': props<{ payload: Omit<Product, 'id' | 'is_active'> }>(),
    'Update Product': props<{ id: string; payload: Partial<Omit<Product, 'id'>> }>(),
    'Deactivate Product': props<{ id: string }>()
  }
});

