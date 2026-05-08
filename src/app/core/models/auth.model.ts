export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  created_at: string;
}

export interface LoginCredentials {
  email_or_username: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

export interface AuthSession {
  access_token: string;
  token_type: 'Bearer' | string;
  expires_at: string;
  user: AuthUser;
}

export interface StoredAuthSession {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
}
