import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState, productsFeatureKey } from './products.reducer';

export const selectProductsState = createFeatureSelector<ProductState>(productsFeatureKey);
export const selectAllProducts = createSelector(selectProductsState, (state) => state.products);
export const selectActiveProducts = createSelector(selectAllProducts, (products) => products.filter((product) => product.is_active));
export const selectProductById = (id: string) =>
  createSelector(selectAllProducts, (products) => products.find((product) => product.id === id) ?? null);
export const selectSelectedProduct = createSelector(selectProductsState, (state) => state.selected);

