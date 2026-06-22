import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_URL, AUTH_TOKEN_STORAGE_KEY } from './auth.tokens';

import type {
  AuthResponse,
  LocalRegisteredUser,
  LoginPayload,
  RegisterPayload,
} from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly tokenStorageKey = inject(AUTH_TOKEN_STORAGE_KEY);
  private readonly localUsersStorageKey = 'shopfront_registered_users';

  private readonly token = signal<string | null>(this.getStoredToken());

  readonly isAuthenticated = computed(() => Boolean(this.token()));

  getToken(): string | null {
    return this.token();
  }

  isLoggedUser(): boolean {
    return this.isAuthenticated();
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const localUser = this.findLocalUser(payload);

    if (localUser) {
      const response = this.createLocalAuthResponse(localUser);
      this.saveToken(response.accessToken);

      return response;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.apiUrl}/auth/login`,
          {
            username: payload.username,
            password: payload.password,
            expiresInMins: 30,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.saveToken(response.accessToken);

      return response;
    } catch (error) {
      throw new Error(this.getApiErrorMessage(error, 'Неверный username или пароль'), {
        cause: error,});
    }
  }

  async register(payload: RegisterPayload): Promise<void> {
    const users = this.getLocalUsers();
    const normalizedEmail = payload.email.trim().toLowerCase();

    const userAlreadyExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (userAlreadyExists) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser: LocalRegisteredUser = {
      id: Date.now(),
      name: payload.name.trim(),
      email: normalizedEmail,
      passwordHash: this.createPasswordHash(payload.password),
    };

    localStorage.setItem(this.localUsersStorageKey, JSON.stringify([...users, newUser]));
  }

  loginWithGoogleToken(idToken: string): void {
    this.saveToken(idToken);
  }

  private findLocalUser(payload: LoginPayload): LocalRegisteredUser | null {
    const login = payload.username.trim().toLowerCase();
    const passwordHash = this.createPasswordHash(payload.password);

    return (
      this.getLocalUsers().find(
        (user) => user.email.toLowerCase() === login && user.passwordHash === passwordHash,
      ) ?? null
    );
  }

  private getLocalUsers(): LocalRegisteredUser[] {
    const rawUsers = localStorage.getItem(this.localUsersStorageKey);

    if (!rawUsers) {
      return [];
    }

    try {
      return JSON.parse(rawUsers) as LocalRegisteredUser[];
    } catch {
      return [];
    }
  }

  private createLocalAuthResponse(user: LocalRegisteredUser): AuthResponse {
    return {
      id: user.id,
      username: user.email,
      email: user.email,
      firstName: user.name,
      lastName: '',
      accessToken: `local-token-${user.id}`,
      refreshToken: `local-refresh-token-${user.id}`,
    };
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
    this.token.set(token);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  private createPasswordHash(password: string): string {
    return btoa(password);
  }

  private getApiErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message || fallback;
    }

    return fallback;
  }
}
