import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment.local';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { API_URL, AUTH_TOKEN_STORAGE_KEY } from './auth/auth.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    { provide: API_URL, useValue: environment.apiUrl },
    { provide: AUTH_TOKEN_STORAGE_KEY, useValue: 'shopfront_auth_token' },
  ],
};
