import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductType } from '../models/product.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class ProductsService extends ApiBaseService {
  list(productType?: ProductType): Observable<Product[]> {
    const query = productType ? `?product_type=${encodeURIComponent(productType)}` : '';
    return this.get<Product[]>(`/products${query}`);
  }

  detail(id: string): Observable<Product> {
    return this.get<Product>(`/products/${id}`);
  }

  create(payload: Omit<Product, 'id' | 'is_active'>): Observable<Product> {
    return this.post<Product>('/products', this.toPayload(payload));
  }

  update(id: string, payload: Partial<Omit<Product, 'id'>>): Observable<Product> {
    return this.put<Product>(`/products/${id}`, this.toPayload(payload));
  }

  deactivate(id: string): Observable<void> {
    return this.delete<void>(`/products/${id}`);
  }

  private toPayload(payload: Partial<Omit<Product, 'id'>>): unknown {
    return {
      ...payload,
      ...(payload.base_price !== undefined ? { base_price: this.decimal(payload.base_price) } : {}),
      ...(payload.cost_price !== undefined ? { cost_price: this.decimal(payload.cost_price) } : {})
    };
  }
}
