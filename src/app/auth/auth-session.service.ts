import {
  Injectable,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  AUTH_TOKEN_STORAGE_KEY,
} from './auth.tokens';

import type {
  ApiAuthSession,
  AuthSession,
  AuthSessionStorage,
  AuthUser,
} from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService
  implements OnDestroy
{
  private readonly storageKey =
    inject(AUTH_TOKEN_STORAGE_KEY);

  private readonly session =
    signal<AuthSession | null>(
      this.restoreSession(),
    );

  private expirationTimer:
    | ReturnType<typeof setTimeout>
    | null = null;

  readonly isAuthenticated = computed(
    () => this.session() !== null,
  );

  constructor() {
    this.scheduleSessionExpiration(
      this.session(),
    );
  }

  ngOnDestroy(): void {
    this.clearExpirationTimer();
  }

  getApiAccessToken(): string | null {
    const session =
      this.getValidSession();

    return session?.type === 'api'
      ? session.token
      : null;
  }

  saveSession(
    session: AuthSession,
    storage: AuthSessionStorage,
  ): void {
    const targetStorage =
      storage === 'local'
        ? localStorage
        : sessionStorage;

    const otherStorage =
      storage === 'local'
        ? sessionStorage
        : localStorage;

    otherStorage.removeItem(
      this.storageKey,
    );

    targetStorage.setItem(
      this.storageKey,
      JSON.stringify(session),
    );

    this.session.set(session);
    this.scheduleSessionExpiration(
      session,
    );
  }

  updateSessionUser(
    user: AuthUser,
  ): void {
    const session =
      this.getValidSession();

    if (!session) {
      return;
    }

    const updatedSession: AuthSession = {
      ...session,
      user,
    };

    const storage:
      AuthSessionStorage =
      localStorage.getItem(
        this.storageKey,
      )
        ? 'local'
        : 'session';

    this.saveSession(
      updatedSession,
      storage,
    );
  }

  logout(): void {
    this.clearExpirationTimer();

    localStorage.removeItem(
      this.storageKey,
    );
    sessionStorage.removeItem(
      this.storageKey,
    );

    this.session.set(null);
  }

  private restoreSession():
    AuthSession | null {
    const localValue =
      localStorage.getItem(
        this.storageKey,
      );

    const sessionValue =
      sessionStorage.getItem(
        this.storageKey,
      );

    const rawSession =
      localValue ?? sessionValue;

    if (!rawSession) {
      return null;
    }

    const storage =
      localValue !== null
        ? localStorage
        : sessionStorage;

    try {
      const parsed: unknown =
        JSON.parse(rawSession);

      if (
        !this.isAuthSession(parsed) ||
        !this.isSessionValid(parsed)
      ) {
        storage.removeItem(
          this.storageKey,
        );

        return null;
      }

      return parsed;
    } catch {
      storage.removeItem(
        this.storageKey,
      );

      return null;
    }
  }

  private getValidSession():
    AuthSession | null {
    const currentSession =
      this.session();

    if (!currentSession) {
      return null;
    }

    if (
      !this.isSessionValid(
        currentSession,
      )
    ) {
      this.logout();
      return null;
    }

    return currentSession;
  }

  private isSessionValid(
    session: AuthSession,
  ): boolean {
    return (
      session.expiresAt === null ||
      session.expiresAt > Date.now()
    );
  }

  private scheduleSessionExpiration(
    session: AuthSession | null,
  ): void {
    this.clearExpirationTimer();

    if (!session?.expiresAt) {
      return;
    }

    const delay =
      session.expiresAt -
      Date.now();

    if (delay <= 0) {
      this.logout();
      return;
    }

    const maxTimeout =
      2_147_483_647;

    this.expirationTimer =
      setTimeout(
        () => this.logout(),
        Math.min(
          delay,
          maxTimeout,
        ),
      );
  }

  private clearExpirationTimer():
    void {
    if (
      this.expirationTimer !== null
    ) {
      clearTimeout(
        this.expirationTimer,
      );

      this.expirationTimer = null;
    }
  }

  private isAuthSession(
    value: unknown,
  ): value is AuthSession {
    if (
      typeof value !== 'object' ||
      value === null
    ) {
      return false;
    }

    const session =
      value as Partial<AuthSession>;

    if (
      session.type !== 'api' &&
      session.type !== 'google' &&
      session.type !== 'local'
    ) {
      return false;
    }

    if (
      typeof session.token !==
      'string' ||
      !session.token ||
      (
        session.expiresAt !==
        null &&
        typeof session.expiresAt !==
        'number'
      ) ||
      !this.isAuthUser(
        session.user,
      )
    ) {
      return false;
    }

    return (
      session.type !== 'api' ||
      typeof (
        session as
          Partial<ApiAuthSession>
      ).refreshToken === 'string'
    );
  }

  private isAuthUser(
    value: unknown,
  ): value is AuthUser {
    if (
      typeof value !== 'object' ||
      value === null
    ) {
      return false;
    }

    const user =
      value as Partial<AuthUser>;

    return (
      (
        typeof user.id ===
        'number' ||
        typeof user.id ===
        'string'
      ) &&
      typeof user.username ===
      'string' &&
      typeof user.email ===
      'string' &&
      typeof user.firstName ===
      'string' &&
      typeof user.lastName ===
      'string' &&
      (
        user.image === undefined ||
        typeof user.image ===
        'string'
      )
    );
  }
}
