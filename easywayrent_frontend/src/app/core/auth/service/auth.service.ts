import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  token_type: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {
    // Check if the user is already logged in (token in localStorage)
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem('current_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => this.handleAuthentication(response)),
        catchError(this.handleError)
      );
  }

  register(user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
      tap((response) => this.handleAuthentication(response)),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    // If the user is not logged in, no need to call the API
    if (!this.currentUserSubject.value) {
      this.clearAuthData();
      this.router.navigate(['/login']);
      return new Observable((observer) => {
        observer.next({ message: 'Logged out successfully.' });
        observer.complete();
      });
    }

    // Otherwise, call the API to revoke the token
    const headers = this.getAuthHeaders();
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/logout`, {}, { headers })
      .pipe(
        tap(() => {
          this.clearAuthData();
          this.router.navigate(['/login']);
        }),
        catchError(this.handleError)
      );
  }

  private handleAuthentication(response: AuthResponse): void {
    // Store the token and user information
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'admin';
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return { 'Content-Type': 'application/json' };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = error.error.message || 'Invalid credentials';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  getUserProfile(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Updates the user's password
   */
  updatePassword(passwordData: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/password`, passwordData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Updates the user information in local storage and the BehaviorSubject
   */
  updateUserInfo(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
