import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  Injectable,
  computed,
  inject,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_URL } from './auth.tokens';
import { AuthSessionService } from './auth-session.service';
import {
  AuthError,
  type ApiAuthSession,
  type AuthResponse,
  type AuthUser,
  type GoogleAuthSession,
  type LocalAuthSession,
  type LocalRegisteredUser,
  type LoginPayload,
  type RegisterPayload,
} from './auth.types';
import {
  decodeJwt,
  getJwtExpiresAt,
} from './jwt.utils';
import { LocalAuthService } from './local-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly localAuthService =
    inject(LocalAuthService);
  private readonly sessionService =
    inject(AuthSessionService);

  readonly isAuthenticated = computed(
    () => this.sessionService.isAuthenticated(),
  );

  getApiAccessToken(): string | null {
    return this.sessionService.getApiAccessToken();
  }

  async login(
    payload: LoginPayload,
  ): Promise<AuthResponse> {
    const localUser =
      this.localAuthService.findUserByEmail(
        payload.username,
      );

    if (localUser) {
      const passwordMatches =
        await this.localAuthService.verifyPassword(
          localUser,
          payload.password,
        );

      if (!passwordMatches) {
        throw new AuthError(
          'invalidCredentials',
        );
      }

      return this.loginLocalUser(
        localUser,
        payload.rememberMe,
      );
    }

    return this.loginApiUser(payload);
  }

  async register(
    payload: RegisterPayload,
  ): Promise<void> {
    await this.localAuthService.register(
      payload,
    );
  }

  loginWithGoogleCredential(
    credential: string,
    rememberMe = true,
  ): void {
    const payload = decodeJwt(credential);
    const expiresAt =
      getJwtExpiresAt(payload);

    if (
      !payload ||
      !expiresAt ||
      expiresAt <= Date.now()
    ) {
      throw new AuthError(
        'sessionExpired',
      );
    }

    const fullName =
      payload.name?.trim() ?? '';

    const [
      firstName = '',
      ...lastNameParts
    ] = fullName.split(/\s+/);

    const session: GoogleAuthSession = {
      type: 'google',
      token: credential,
      expiresAt,
      user: {
        id:
          payload.sub ??
          payload.email ??
          'google-user',
        username:
          payload.email ??
          payload.sub ??
          'google-user',
        email: payload.email ?? '',
        firstName:
          payload.given_name ??
          firstName,
        lastName:
          payload.family_name ??
          lastNameParts.join(' '),
        image: payload.picture,
      },
    };

    this.sessionService.saveSession(
      session,
      rememberMe
        ? 'local'
        : 'session',
    );
  }

  logout(): void {
    this.sessionService.logout();
  }

  private async loginApiUser(
    payload: LoginPayload,
  ): Promise<AuthResponse> {
    let response: AuthResponse;

    try {
      response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.apiUrl}/auth/login`,
          {
            username:
              payload.username.trim(),
            password: payload.password,
            expiresInMins: 30,
          },
        ),
      );
    } catch (error: unknown) {
      throw this.mapHttpError(
        error,
        'invalidCredentials',
      );
    }

    if (!response.accessToken) {
      throw new AuthError(
        'missingAccessToken',
      );
    }

    const expiresAt =
      getJwtExpiresAt(
        decodeJwt(
          response.accessToken,
        ),
      ) ??
      Date.now() +
      30 * 60 * 1000;

    const session: ApiAuthSession = {
      type: 'api',
      token: response.accessToken,
      refreshToken:
      response.refreshToken,
      expiresAt,
      user:
        this.authResponseToUser(
          response,
        ),
    };

    this.sessionService.saveSession(
      session,
      payload.rememberMe
        ? 'local'
        : 'session',
    );

    try {
      await this.loadApiCurrentUser();
    } catch (error: unknown) {
      this.logout();
      throw error;
    }

    return response;
  }

  private loginLocalUser(
    user: LocalRegisteredUser,
    rememberMe: boolean,
  ): AuthResponse {
    const response =
      this.localAuthService
        .createAuthResponse(user);

    const session: LocalAuthSession = {
      type: 'local',
      token: response.accessToken,
      expiresAt: null,
      user:
        this.authResponseToUser(
          response,
        ),
    };

    this.sessionService.saveSession(
      session,
      rememberMe
        ? 'local'
        : 'session',
    );

    return response;
  }

  private async loadApiCurrentUser():
    Promise<void> {
    try {
      const user = await firstValueFrom(
        this.http.get<AuthUser>(
          `${this.apiUrl}/auth/me`,
        ),
      );

      this.sessionService
        .updateSessionUser(user);
    } catch (error: unknown) {
      throw this.mapHttpError(
        error,
        'unauthorized',
      );
    }
  }

  private authResponseToUser(
    response: AuthResponse,
  ): AuthUser {
    return {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      image: response.image,
    };
  }

  private mapHttpError(
    error: unknown,
    authFailureCode:
      | 'invalidCredentials'
      | 'unauthorized',
  ): AuthError {
    if (
      !(
        error instanceof
        HttpErrorResponse
      )
    ) {
      return new AuthError(
        'unknown',
        {
          cause: error,
        },
      );
    }

    if (error.status === 0) {
      return new AuthError(
        'network',
        {
          cause: error,
        },
      );
    }

    if (
      error.status === 400 ||
      error.status === 401
    ) {
      return new AuthError(
        authFailureCode,
        {
          cause: error,
        },
      );
    }

    if (error.status >= 500) {
      return new AuthError(
        'serverUnavailable',
        {
          cause: error,
        },
      );
    }

    return new AuthError(
      'unknown',
      {
        cause: error,
      },
    );
  }
}
