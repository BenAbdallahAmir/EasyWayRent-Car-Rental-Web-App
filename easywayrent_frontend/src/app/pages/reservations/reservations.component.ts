import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  ReservationService,
  Reservation,
} from '../../core/services/reservation/reservation.service';
import { AuthService } from '../../core/auth/service/auth.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.errorMessage = null;

    this.reservationService
      .getUserReservations()
      .pipe(
        catchError((error) => {
          // If the backend returns 404 for "no reservations",
          // treat it as an empty array instead of an error
          if (error.status === 404) {
            return of([]);
          }

          // Otherwise, capture and log the error
          console.error('Error loading reservations:', error);
          this.errorMessage =
            error.error?.message || 'Failed to load reservations';
          return of([]);
        })
      )
      .subscribe({
        next: (reservations) => {
          this.reservations = reservations;
          this.loading = false;
        },
        error: (error) => {
          // This part should not be reached thanks to catchError
          this.loading = false;
          this.errorMessage = 'Failed to load reservations';
          Swal.fire('Error', this.errorMessage, 'error');
        },
      });
  }

  cancelReservation(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will cancel your reservation.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.cancelReservation(id).subscribe({
          next: () => {
            // Update the status locally without reloading the page
            const reservation = this.reservations.find((r) => r.id === id);
            if (reservation) {
              reservation.status = 'cancelled';
            }

            Swal.fire(
              'Cancelled!',
              'Your reservation has been cancelled.',
              'success'
            );
          },
          error: (error) => {
            Swal.fire(
              'Error',
              error.error?.message || 'Failed to cancel reservation.',
              'error'
            );
          },
        });
      }
    });
  }
}
