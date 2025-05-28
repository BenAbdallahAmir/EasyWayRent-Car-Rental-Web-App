import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { AuthService } from '../../auth/service/auth.service';
export interface CartItem {
  id: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
  total_price: number;
  reservation_id: number | null;
  car?: {
    id: number;
    brand: string;
    model: string;
    year: number;
    price_per_day: number;
    status: string;
    image: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/carts`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper method to get authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Get all cart items for the current user
  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // Add a car to the cart
  addToCart(cartItem: {
    car_id: number;
    start_date: string;
    end_date: string;
    pickup_location: string;
    dropoff_location: string;
  }): Observable<{ message: string; cart_item: CartItem }> {
    return this.http.post<{ message: string; cart_item: CartItem }>(
      this.apiUrl,
      cartItem,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get a specific cart item
  getCartItem(id: number): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update a cart item
  updateCartItem(
    id: number,
    data: {
      start_date?: string;
      end_date?: string;
      pickup_location?: string;
      dropoff_location?: string;
    }
  ): Observable<{ message: string; cart_item: CartItem }> {
    return this.http.put<{ message: string; cart_item: CartItem }>(
      `${this.apiUrl}/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Remove an item from the cart
  removeFromCart(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Convert cart to reservation
  createReservationFromCart(
    cartId: number,
    paymentMethod: string
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/reservations/from-cart`,
      {
        cart_id: cartId,
        payment_method: paymentMethod,
      },
      { headers: this.getAuthHeaders() }
    );
  }
}
