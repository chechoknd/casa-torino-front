import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthSession, AuthUser, LoginCredentials, RegisterPayload, StoredAuthSession } from '../models/auth.model';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const authStorageKey = 'casa_torino_auth_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = environment.apiUrl;
  private readonly browser = isPlatformBrowser(this.platformId);
  private readonly sessionState = signal<StoredAuthSession | null>(this.loadStoredSession());

  readonly session = this.sessionState.asReadonly();

  readonly user = computed(() => this.sessionState()?.user ?? null);

  login(credentials: LoginCredentials): Observable<StoredAuthSession> {
    return this.http.post<ApiResponse<AuthSession>>(`${this.apiUrl}/auth/login`, credentials).pipe(
      map((response) => this.toStoredSession(response.data)),
      tap((session) => this.setSession(session))
    );
  }

  register(payload: RegisterPayload): Observable<AuthUser> {
    return this.http.post<ApiResponse<AuthUser>>(`${this.apiUrl}/auth/register`, payload).pipe(map((response) => response.data));
  }

  logout(): void {
    this.clearSession();
  }

  isAuthenticated(): boolean {
    return !!this.getValidAccessToken();
  }

  getValidAccessToken(): string | null {
    const session = this.sessionState();

    if (!session) {
      return null;
    }

    if (this.isExpired(session.expiresAt)) {
      this.clearSession();
      return null;
    }

    return session.accessToken;
  }

  private setSession(session: StoredAuthSession): void {
    this.sessionState.set(session);

    if (this.browser) {
      localStorage.setItem(authStorageKey, JSON.stringify(session));
    }
  }

  private clearSession(): void {
    this.sessionState.set(null);

    if (this.browser) {
      localStorage.removeItem(authStorageKey);
    }
  }

  private loadStoredSession(): StoredAuthSession | null {
    if (!this.browser) {
      return null;
    }

    const rawSession = localStorage.getItem(authStorageKey);
    if (!rawSession) {
      return null;
    }

    try {
      const session = JSON.parse(rawSession) as StoredAuthSession;
      if (!this.isStoredSession(session) || this.isExpired(session.expiresAt)) {
        localStorage.removeItem(authStorageKey);
        return null;
      }

      return session;
    } catch {
      localStorage.removeItem(authStorageKey);
      return null;
    }
  }

  private toStoredSession(session: AuthSession): StoredAuthSession {
    return {
      accessToken: session.access_token,
      expiresAt: session.expires_at,
      user: session.user
    };
  }

  private isStoredSession(value: unknown): value is StoredAuthSession {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const session = value as Partial<StoredAuthSession>;
    return typeof session.accessToken === 'string' && typeof session.expiresAt === 'string' && !!session.user;
  }

  private isExpired(expiresAt: string): boolean {
    const expiresAtTime = new Date(expiresAt).getTime();
    return Number.isNaN(expiresAtTime) || expiresAtTime <= Date.now();
  }
}
