import { api } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

function setAuthCookie(token: string | null) {
  if (typeof document !== 'undefined') {
    if (token) {
      document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
  }
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<AuthResponse>('/login', credentials);

    if (response.data) {
      api.setToken(response.data.token);
      setAuthCookie(response.data.token);
    }

    return response;
  },

  async register(data: RegisterData) {
    const response = await api.post<AuthResponse>('/register', data);

    if (response.data) {
      api.setToken(response.data.token);
      setAuthCookie(response.data.token);
    }

    return response;
  },

  async logout() {
    const response = await api.post('/logout');
    api.setToken(null);
    setAuthCookie(null);
    return response;
  },

  async me() {
    return api.get<User>('/me');
  },

  isAuthenticated(): boolean {
    return !!api.getToken();
  },
};
