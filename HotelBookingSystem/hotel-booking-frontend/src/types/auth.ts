export interface User {
  id?: string;
  email: string;
  name: string;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface MockLoginResponse {
  Token: string;
  User: User;
}
