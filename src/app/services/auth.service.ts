import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Backend API URL

  constructor(private http: HttpClient) {}

  // Signup method
  signup(name: string, email: string, password: string): Observable<any> {
    const body = { name, email, password };
    return this.http.post(`${this.apiUrl}/signup`, body);
  }

  // Login method
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  // 🔹 Get user by ID
  getUserById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }

  // 🔹 Update user by ID
  updateUserById(id: number, name: string, email: string, profile: string): Observable<any> {
    const body = { name, email, profile };
    return this.http.put(`${this.apiUrl}/user/${id}`, body);
  }

  // Store token in localStorage
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Get stored token from localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Clear token from localStorage
  clearToken(): void {
    localStorage.clear();
  }

  // Check if the user is logged in (has token)
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  saveUserId(id: string): void {
    localStorage.setItem('user_id', id);
  }
  
  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }
  
}
