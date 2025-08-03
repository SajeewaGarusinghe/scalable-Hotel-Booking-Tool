import { apiClient } from './apiClient';
import { User } from '../types/auth';

interface MockLoginRequest {
  email: string;
  name: string;
}

interface MockLoginResponse {
  Token: string;
  User: User;
}

export class AuthService {
  private static readonly AUTH_BASE = '/api/auth';

  static async mockLogin(email: string, name: string): Promise<MockLoginResponse> {
    const request: MockLoginRequest = { email, name };
    return apiClient.post<MockLoginResponse>(`${this.AUTH_BASE}/mock-login`, request);
  }

  static async getUserInfo(): Promise<User> {
    return apiClient.get<User>(`${this.AUTH_BASE}/user-info`);
  }

  static async logout(): Promise<void> {
    await apiClient.post(`${this.AUTH_BASE}/logout`);
    this.clearAuthData();
  }

  static saveAuthData(token: string, user: User): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getAuthData(): { token: string | null; user: User | null } {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    let user = null;
    
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearAuthData();
      }
    }

    return { token, user };
  }

  static clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    const { token } = this.getAuthData();
    return !!token;
  }
}

export default AuthService;
