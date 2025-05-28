import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../core/services/cart/cart.service';
import { ReservationService } from '../../core/services/reservation/reservation.service';
import { AuthService, User } from '../../core/auth/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = false;
  isProcessing = false;
  paymentMethod = 'credit_card'; // Default payment method
  currentUser: User | null = null;

  constructor(
    private cartService: CartService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.loading = true;
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.loading = false;

        // If cart is empty, redirect to cart page
        if (items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        this.loading = false;
        if (error.status === 401) {
          this.authService.logout();
        } else {
          Swal.fire(
            'Error',
            'Failed to load cart items. Please try again.',
            'error'
          );
          this.router.navigate(['/cart']);
        }
      },
    });
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.total_price, 0);
  }

  completeCheckout(): void {
    if (!this.paymentMethod || this.cartItems.length === 0) {
      Swal.fire(
        'Error',
        'Please select a payment method and ensure your cart is not empty.',
        'error'
      );
      return;
    }
    this.isProcessing = true;
    const validationPromises = this.cartItems.map((item) =>
      this.reservationService.getReservationForClient(item.id).subscribe({
        error: (error) => {
          throw new Error(
            `Item ${item.id} is no longer valid: ${error.error.message}`
          );
        },
      })
    );
    Promise.all(validationPromises)
      .then(() => {
        const reservationPromises = this.cartItems.map((item) =>
          this.cartService
            .createReservationFromCart(item.id, this.paymentMethod)
            .toPromise()
        );
        return Promise.all(reservationPromises);
      })
      .then(() => {
        this.isProcessing = false;
        Swal.fire({
          title: 'Success!',
          text: 'Your reservations have been successfully created.',
          icon: 'success',
          confirmButtonText: 'View My Reservations',
        }).then(() => {
          this.router.navigate(['/reservations']);
        });
      })
      .catch((error) => {
        this.isProcessing = false;
        Swal.fire(
          'Error',
          `Failed to complete reservations: ${error.message}`,
          'error'
        );
      });
  }
}
