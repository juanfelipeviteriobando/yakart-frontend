import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface LoginResponse {
  access_token: string;
  rol: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/auth';

  // 🔹 LOGIN
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('userEmail', res.email);
        localStorage.setItem('userRole', res.rol);
      }),
      catchError(err => {
        const msg = err.error?.message || 'Error during login';
        return throwError(() => new Error(msg));
      })
    );
  }

  // 🔹 LOGOUT
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.router.navigate(['/auth/login']);
  }

  // 🔹 REGISTER
  register(data: { email: string; username: string; password: string; phone?: string; direction?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Error during registration')))
    );
  }

  // 🔹 ACTIVATE ACCOUNT
  activateAccount(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/activate`, { token }).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Invalid activation token')))
    );
  }

  // 🔹 FORGOT PASSWORD
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Error sending recovery email')))
    );
  }

  // 🔹 RESET PASSWORD
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Error resetting password')))
    );
  }

  // 🔹 HELPER METHODS
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}
