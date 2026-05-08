import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { getApiErrorCode } from '../auth/auth-error.util';
import { AuthService } from '../services/auth.service';
import { NotifierService } from '../services/notifier.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notifier = inject(NotifierService);
  const isApiRequest = isBackendApiRequest(req.url);
  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');
  const token = isApiRequest && !isAuthRequest ? auth.getValidAccessToken() : null;
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && isApiRequest && !isAuthRequest && error.status === 401) {
        auth.logout();
        notifier.error(getApiErrorCode(error) === 'UNAUTHORIZED' ? 'Sesion expirada o no iniciada.' : 'Sesion expirada.');
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }

      return throwError(() => error);
    })
  );
};

function isBackendApiRequest(url: string): boolean {
  const apiUrl = environment.apiUrl.replace(/\/$/, '');

  if (apiUrl.startsWith('/')) {
    return url === apiUrl || url.startsWith(`${apiUrl}/`);
  }

  try {
    const requestUrl = new URL(url);
    const baseUrl = new URL(apiUrl);
    const basePath = baseUrl.pathname.replace(/\/$/, '');
    const matchesPath = basePath ? requestUrl.pathname === basePath || requestUrl.pathname.startsWith(`${basePath}/`) : true;

    return requestUrl.origin === baseUrl.origin && matchesPath;
  } catch {
    return false;
  }
}
