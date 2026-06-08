import { Injectable, computed, signal } from '@angular/core';

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from './auth.types';

const AUTH_TOKEN_KEY = 'shopfront_auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly token = signal<string | null>(this.getStoredToken());

  readonly isAuthenticated = computed(() => Boolean(this.token()));

  isLoggedUser(): boolean {
    return this.isAuthenticated();
  }
  
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await this.fakeRequestDelay();

    if (payload.email === 'test@test.com' && payload.password === 'Password123') {
      const response: AuthResponse = {
        token: 'mock-auth-token',
      };

      this.saveToken(response.token);

      return response;
    }

    throw new Error('Неверный адрес электронной почты или пароль');
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await this.fakeRequestDelay();

    if (payload.email === 'exists@test.com') {
      throw new Error('Пользователь с таким email уже существует');
    }

    const response: AuthResponse = {
      token: 'mock-auth-token',
    };

    this.saveToken(response.token);

    return response;
  }

  logout(): void {
    if (this.hasLocalStorage()) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    this.token.set(null);
  }

  private saveToken(token: string): void {
    if (this.hasLocalStorage()) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    this.token.set(token);
  }

  private getStoredToken(): string | null {
    if (!this.hasLocalStorage()) {
      return null;
    }

    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private hasLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private fakeRequestDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 600);
    });
  }
}
