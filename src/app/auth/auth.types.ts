export type AuthMode = 'login' | 'register';
export type AuthSessionStorage = 'local' | 'session';
export type AuthSessionType = 'api' | 'google' | 'local';

export type AuthErrorCode =
  | 'invalidCredentials'
  | 'missingAccessToken'
  | 'network'
  | 'serverUnavailable'
  | 'sessionExpired'
  | 'unauthorized'
  | 'unknown'
  | 'userExists';

export class AuthError extends Error {
  constructor(
    readonly code: AuthErrorCode,
    options?: ErrorOptions,
  ) {
    super(code, options);

    this.name = 'AuthError';
  }
}

export interface LoginPayload {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number | string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

export interface AuthResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

export interface LocalRegisteredUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

interface AuthSessionBase {
  type: AuthSessionType;
  token: string;
  expiresAt: number | null;
  user: AuthUser;
}

export interface ApiAuthSession extends AuthSessionBase {
  type: 'api';
  refreshToken: string;
}

export interface LocalAuthSession extends AuthSessionBase {
  type: 'local';
  expiresAt: null;
}

export interface GoogleAuthSession extends AuthSessionBase {
  type: 'google';
}

export type AuthSession =
  | ApiAuthSession
  | GoogleAuthSession
  | LocalAuthSession;

export interface JwtPayload {
  exp?: number;
  sub?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}
