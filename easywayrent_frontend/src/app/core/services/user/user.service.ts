import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { User } from '../../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl+"/admin";

  constructor(private http: HttpClient) {}

  // Get the header with the authentication token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getusers`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get all administrators (admin only)
  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getadmins`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get all clients (admin only)
  getClients(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getclients`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Add a new user (registration)
  register(userData: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/auth/register', userData);
  }

  // Promote a user to admin
  promoteToAdmin(userId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/users/${userId}/setAdmin`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Update a user
  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user_update/${userId}`, userData, {
      headers: this.getAuthHeaders(),
    });
  }

  // Delete a user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user_delete/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

