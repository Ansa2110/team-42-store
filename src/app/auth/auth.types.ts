export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

export interface LocalRegisteredUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

export interface GoogleAuthResponse {
  credential?: string;
}
