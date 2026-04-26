import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../core/models/product.model';
import { productsActions } from './products.actions';

export interface ProductState {
  products: Product[];
  selected: Product | null;
  loading: boolean;
  error: string | null;
}

export const initialProductState: ProductState = {
  products: [],
  selected: null,
  loading: false,
  error: null
};

export const productsFeatureKey = 'products';

export const productsReducer = createReducer(
  initialProductState,
  on(
    productsActions.loadProducts,
    productsActions.loadProductDetail,
    productsActions.createProduct,
    productsActions.updateProduct,
    productsActions.deactivateProduct,
    (state) => ({ ...state, loading: true, error: null })
  ),
  on(productsActions.loadProductsSuccess, (state, { products }) => ({ ...state, products, loading: false })),
  on(productsActions.loadProductDetailSuccess, (state, { product }) => ({ ...state, selected: product, loading: false })),
  on(productsActions.loadProductsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);

