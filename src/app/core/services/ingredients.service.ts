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
    return this.post<Ingredient>('/ingredients', payload);
  }

  update(id: string, payload: Partial<Omit<Ingredient, 'id'>>): Observable<Ingredient> {
    return this.put<Ingredient>(`/ingredients/${id}`, payload);
  }

  deactivate(id: string): Observable<void> {
    return this.delete<void>(`/ingredients/${id}`);
  }
}

