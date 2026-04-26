import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiBaseService {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;

  protected get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`);
  }

  protected post<T>(path: string, payload: unknown): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, payload);
  }

  protected put<T>(path: string, payload: unknown): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, payload);
  }

  protected patch<T>(path: string, payload: unknown): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${path}`, payload);
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`);
  }
}

