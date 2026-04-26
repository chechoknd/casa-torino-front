import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class ProductsService extends ApiBaseService {
  list(): Observable<Product[]> {
    return this.get<Product[]>('/products');
  }

  detail(id: string): Observable<Product> {
    return this.get<Product>(`/products/${id}`);
  }

  create(payload: Omit<Product, 'id' | 'is_active'>): Observable<Product> {
    return this.post<Product>('/products', payload);
  }

  update(id: string, payload: Partial<Omit<Product, 'id'>>): Observable<Product> {
    return this.put<Product>(`/products/${id}`, payload);
  }

  deactivate(id: string): Observable<void> {
    return this.delete<void>(`/products/${id}`);
  }
}

