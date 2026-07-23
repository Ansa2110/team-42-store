import {
  Injectable,
} from '@angular/core';

import {
  AuthError,
} from './auth.types';

import type {
  AuthResponse,
  LocalRegisteredUser,
  RegisterPayload,
} from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class LocalAuthService {
  private readonly storageKey =
    'shopfront_registered_users';

  async register(
    payload: RegisterPayload,
  ): Promise<void> {
    const users = this.getUsers();

    const normalizedEmail =
      payload.email
        .trim()
        .toLowerCase();

    const userAlreadyExists =
      users.some(
        (user) =>
          user.email
            .toLowerCase() ===
          normalizedEmail,
      );

    if (userAlreadyExists) {
      throw new AuthError(
        'userExists',
      );
    }

    const newUser:
      LocalRegisteredUser = {
      id: Date.now(),
      name: payload.name.trim(),
      email: normalizedEmail,
      passwordHash:
        await this.hashPassword(
          payload.password,
        ),
    };

    this.saveUsers([
      ...users,
      newUser,
    ]);
  }

  findUserByEmail(
    username: string,
  ): LocalRegisteredUser | null {
    const normalizedUsername =
      username
        .trim()
        .toLowerCase();

    return (
      this.getUsers().find(
        (user) =>
          user.email
            .toLowerCase() ===
          normalizedUsername,
      ) ?? null
    );
  }

  async verifyPassword(
    user: LocalRegisteredUser,
    password: string,
  ): Promise<boolean> {
    const passwordHash =
      await this.hashPassword(
        password,
      );

    return (
      user.passwordHash ===
      passwordHash
    );
  }

  createAuthResponse(
    user: LocalRegisteredUser,
  ): AuthResponse {
    return {
      id: user.id,
      username: user.email,
      email: user.email,
      firstName: user.name,
      lastName: '',
      accessToken:
        `local-token-${user.id}`,
      refreshToken: '',
    };
  }

  private getUsers():
    LocalRegisteredUser[] {
    const rawUsers =
      localStorage.getItem(
        this.storageKey,
      );

    if (!rawUsers) {
      return [];
    }

    try {
      const parsed: unknown =
        JSON.parse(rawUsers);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        this.isLocalRegisteredUser,
      );
    } catch {
      return [];
    }
  }

  private saveUsers(
    users: LocalRegisteredUser[],
  ): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(users),
    );
  }

  private async hashPassword(
    password: string,
  ): Promise<string> {
    const bytes =
      new TextEncoder().encode(
        password,
      );

    const digest =
      await crypto.subtle.digest(
        'SHA-256',
        bytes,
      );

    return Array.from(
      new Uint8Array(digest),
      (byte) =>
        byte
          .toString(16)
          .padStart(2, '0'),
    ).join('');
  }

  private readonly isLocalRegisteredUser = (
    value: unknown,
  ): value is LocalRegisteredUser => {
    if (
      typeof value !== 'object' ||
      value === null
    ) {
      return false;
    }

    const user =
      value as
        Partial<LocalRegisteredUser>;

    return (
      typeof user.id ===
      'number' &&
      typeof user.name ===
      'string' &&
      typeof user.email ===
      'string' &&
      typeof user.passwordHash ===
      'string'
    );
  };
}
