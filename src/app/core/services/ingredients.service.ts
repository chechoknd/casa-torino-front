import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class IngredientsService extends ApiBaseService {
  list(): Observable<Ingredient[]> {
    return this.get<Ingredient[]>('/ingredients');
  }

  detail(id: string): Observable<Ingredient> {
    return this.get<Ingredient>(`/ingredients/${id}`);
  }

  create(payload: Omit<Ingredient, 'id' | 'is_active'>): Observable<Ingredient> {
    return this.post<Ingredient>('/ingredients', this.toPayload(payload));
  }

  update(id: string, payload: Partial<Omit<Ingredient, 'id'>>): Observable<Ingredient> {
    return this.put<Ingredient>(`/ingredients/${id}`, this.toPayload(payload));
  }

  deactivate(id: string): Observable<void> {
    return this.delete<void>(`/ingredients/${id}`);
  }

  private toPayload(payload: Partial<Omit<Ingredient, 'id'>>): unknown {
    return {
      ...payload,
      ...(payload.average_cost !== undefined ? { average_cost: this.decimal(payload.average_cost) } : {}),
      ...(payload.stock !== undefined ? { stock: this.decimal(payload.stock) } : {}),
      ...(payload.minimum_stock !== undefined ? { minimum_stock: this.decimal(payload.minimum_stock) } : {})
    };
  }
}
