import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class CustomersService extends ApiBaseService {
  list(): Observable<Customer[]> {
    return this.get<Customer[]>('/customers');
  }

  detail(id: string): Observable<Customer> {
    return this.get<Customer>(`/customers/${id}`);
  }

  create(payload: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Observable<Customer> {
    return this.post<Customer>('/customers', payload);
  }

  update(
    id: string,
    payload: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>
  ): Observable<Customer> {
    return this.put<Customer>(`/customers/${id}`, payload);
  }

  deactivate(id: string): Observable<void> {
    return this.delete<void>(`/customers/${id}`);
  }
}

