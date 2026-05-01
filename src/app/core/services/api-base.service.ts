import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const numericResponseFields = new Set([
  'average_cost',
  'base_price',
  'cost',
  'cost_price',
  'discount',
  'minimum_stock',
  'portions',
  'quantity',
  'stock',
  'subtotal',
  'total',
  'total_cost',
  'unit_price',
  'amount'
]);

@Injectable({ providedIn: 'root' })
export class ApiBaseService {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;

  protected get<T>(path: string): Observable<T> {
    return this.http.get<ApiResponse<T> | T>(`${this.apiUrl}${path}`).pipe(map((response) => this.unwrapResponse<T>(response)));
  }

  protected post<T>(path: string, payload: unknown): Observable<T> {
    return this.http.post<ApiResponse<T> | T>(`${this.apiUrl}${path}`, payload).pipe(map((response) => this.unwrapResponse<T>(response)));
  }

  protected put<T>(path: string, payload: unknown): Observable<T> {
    return this.http.put<ApiResponse<T> | T>(`${this.apiUrl}${path}`, payload).pipe(map((response) => this.unwrapResponse<T>(response)));
  }

  protected patch<T>(path: string, payload: unknown): Observable<T> {
    return this.http.patch<ApiResponse<T> | T>(`${this.apiUrl}${path}`, payload).pipe(map((response) => this.unwrapResponse<T>(response)));
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T> | T>(`${this.apiUrl}${path}`).pipe(map((response) => this.unwrapResponse<T>(response)));
  }

  protected decimal(value: number | string | null | undefined): string {
    return String(value ?? 0);
  }

  private unwrapResponse<T>(response: ApiResponse<T> | T): T {
    const body = this.isApiResponse<T>(response) ? response.data : response;
    return this.normalizeResponse(body) as T;
  }

  private isApiResponse<T>(response: ApiResponse<T> | T): response is ApiResponse<T> {
    return !!response && typeof response === 'object' && 'data' in response;
  }

  private normalizeResponse(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeResponse(item));
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    return Object.entries(value).reduce<Record<string, unknown>>((normalized, [key, entry]) => {
      const normalizedEntry = this.normalizeResponse(entry);
      normalized[key] = this.normalizeNumericField(key, normalizedEntry);

      if (key === 'portions' && !('servings' in normalized)) {
        normalized['servings'] = this.normalizeNumericField(key, normalizedEntry);
      }

      return normalized;
    }, {});
  }

  private normalizeNumericField(key: string, value: unknown): unknown {
    if (numericResponseFields.has(key) && typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }

    return value;
  }
}
