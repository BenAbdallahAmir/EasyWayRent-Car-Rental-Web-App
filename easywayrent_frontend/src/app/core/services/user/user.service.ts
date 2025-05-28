// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { environment } from '../../../../../src/environments/environment';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   private apiUrl = `${environment.apiUrl}`;
//   private currentUser = new BehaviorSubject<any>(null);
//   public currentUser$ = this.currentUser.asObservable();
//   private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

//   constructor(private http: HttpClient, private router: Router) {}
//   register(userData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/auth/register`, userData);
//   }

//   login(credentials: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/auth/login`, credentials);
//   }

  // logout(): void {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).subscribe({
  //     next: () => {
  //       localStorage.clear();
  //       this.isLoggedInSubject.next(false);
  //       this.currentUser.next(null);
  //         localStorage.removeItem('user');
  //         localStorage.removeItem('token');
  //       this.router.navigate(['/home']);
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors du logout', err);
  //       localStorage.clear();
  //       this.isLoggedInSubject.next(false);
  //       this.currentUser.next(null);
  //       this.router.navigate(['/home']);
  //     },
  //   });
  // }
  // logout(): void {
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('token');
  //   this.isLoggedInSubject.next(false);
  //   this.currentUser.next(null);
  //   this.router.navigate(['/home']);
  // }

  // setSession(data: any): void {
  //   localStorage.setItem('token', data.token);
  //   localStorage.setItem('user', JSON.stringify(data.user));
  //   this.currentUser.next(data.user);
  // }

  // getUser(): any {
  //   const user = localStorage.getItem('user');
  //   return user ? JSON.parse(user) : null;
  // }

  // getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  // private hasToken(): boolean {
  //   return !!localStorage.getItem('token');
  // }

  // isAuthenticated(): boolean {
  //   return !!this.getToken();
  // }

  // clearSession(): void {
  //   localStorage.clear();
  //   this.currentUser.next(null);
  // }
  // getAllUsers(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/admin/getusers`);
  // }
  // isLoggedIn(): boolean {
  //   return !!localStorage.getItem('token'); // ou selon ta logique
  // }
// }
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

  // Récupérer l'en-tête avec le token d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Récupérer tous les utilisateurs (admin seulement)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getusers`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Récupérer tous les administrateurs (admin seulement)
  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getadmins`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Récupérer tous les clients (admin seulement)
  getClients(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getclients`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Ajouter un nouvel utilisateur (inscription)
  register(userData: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/auth/register', userData);
  }

  // Promouvoir un utilisateur en admin
  promoteToAdmin(userId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/users/${userId}/setAdmin`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Mettre à jour un utilisateur
  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user_update/${userId}`, userData, {
      headers: this.getAuthHeaders(),
    });
  }

  // Supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user_delete/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
