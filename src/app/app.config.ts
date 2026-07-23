import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import {
  API_URL,
  AUTH_TOKEN_STORAGE_KEY,
} from './auth/auth.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'ru',
      lang: 'ru',
    }),

    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
    {
      provide: AUTH_TOKEN_STORAGE_KEY,
      useValue: 'shopfront_auth_token',
    },
  ],
};
