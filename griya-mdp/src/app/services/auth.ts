import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface untuk response
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
  };
}

// Interface untuk register request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Interface untuk login request
export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Register user baru
   * @param data - Data registrasi (name, email, password, confirmPassword)
   * @returns Observable dengan response dari backend
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  /**
   * Login user
   * @param data - Data login (email, password)
   * @returns Observable dengan response dari backend
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  /**
   * Get user profile by ID
   * @param userId - ID user
   * @returns Observable dengan data user
   */
  getProfile(userId: string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/profile/${userId}`);
  }

  /**
   * Save user data ke localStorage
   * @param userData - Data user yang akan disimpan
   */
  saveUserData(userData: any): void {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  /**
   * Get user data dari localStorage
   * @returns User data atau null
   */
  getUserData(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Cek apakah user sudah login
   * @returns boolean
   */
  isLoggedIn(): boolean {
    return this.getUserData() !== null;
  }

  /**
   * Logout user (hapus data dari localStorage)
   */
  logout(): void {
    localStorage.removeItem('user');
  }
}