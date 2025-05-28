import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { AuthService } from '../../auth/service/auth.service';

export interface Reservation {
  id: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
  total_price: number;
  payment_method: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  car?: {
    id: number;
    brand: string;
    model: string;
    year: number;
    price_per_day: number;
    status: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservations`;
  private adminApiUrl = `${environment.apiUrl}/admin/reservations`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Utiliser les en-têtes d'authentification pour toutes les requêtes
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders(this.authService.getAuthHeaders());
  }

  // Get all reservations (admin only)
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.adminApiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get current user's reservations
  getUserReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get reservation details for admin
  getReservationForAdmin(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.adminApiUrl}/${id}/admin`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get reservation details for client
  getReservationForClient(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}/client`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Create a new reservation
  createReservation(reservation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reservation, {
      headers: this.getAuthHeaders(),
    });
  }

  // Create reservation from cart
  createReservationFromCart(
    cartId: number,
    paymentMethod: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/from-cart`,
      {
        cart_id: cartId,
        payment_method: paymentMethod,
      },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Update reservation details
  updateReservation(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update reservation status (admin only)
  updateReservationStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(
      `${this.adminApiUrl}/${id}`,
      { status },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Cancel reservation (client only)
  cancelReservation(id: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}/cancel`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Delete reservation (admin only)
  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.adminApiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
