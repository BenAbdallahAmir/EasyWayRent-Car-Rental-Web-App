// reservations.component.ts
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
          // Si le backend renvoie 404 pour "aucune réservation",
          // on traite ça comme un tableau vide plutôt qu'une erreur
          if (error.status === 404) {
            return of([]);
          }

          // Sinon on capture et journalise l'erreur
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
          // Cette partie ne devrait pas être atteinte grâce au catchError
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
            // Mettre à jour le statut localement sans recharger la page
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
