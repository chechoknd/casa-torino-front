import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error.model';

const apiErrorMessages: Record<string, string> = {
  INVALID_CREDENTIALS: 'Credenciales invalidas.',
  DUPLICATE_EMAIL: 'El email ya esta registrado.',
  DUPLICATE_USERNAME: 'El usuario ya esta registrado.',
  UNAUTHORIZED: 'Sesion expirada o no iniciada.'
};

export function getApiErrorCode(error: unknown): string | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  const body = error.error;
  if (!body || typeof body !== 'object') {
    return null;
  }

  const apiError = body as ApiError;
  return apiError.code ?? null;
}

export function mapApiErrorMessage(error: unknown, fallback = 'No fue posible completar la operacion.'): string {
  const code = getApiErrorCode(error);
  return code ? apiErrorMessages[code] ?? fallback : fallback;
}
