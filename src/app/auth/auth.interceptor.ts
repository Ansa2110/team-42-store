import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { API_URL } from './auth.tokens';

export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
) => {
  const authService = inject(AuthService);
  const apiUrl = inject(API_URL);
  const token = authService.getApiAccessToken();

  const apiRequest = request.url.startsWith(apiUrl);

  const requestWithAuth =
    apiRequest && token
      ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
      : request;

  return next(requestWithAuth).pipe(
    catchError((error: unknown) => {
      if (
        apiRequest &&
        token &&
        error instanceof HttpErrorResponse &&
        error.status === 401
      ) {
        authService.logout();
      }

      return throwError(() => error);
    }),
  );
};
