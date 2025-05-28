import { Component, OnInit } from '@angular/core';
import {
  ReservationService,
  Reservation,
} from '../../../core/services/reservation/reservation.service';
import { AuthService } from '../../../core/auth/service/auth.service';
import {  CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  imports: [RouterModule,CommonModule],
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  isAdmin: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    // private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.errorMessage = '';

    // const observable = this.isAdmin
    //   ? this.reservationService.getAllReservations()
    //   : this.reservationService.getUserReservations();
    const observable= this.reservationService.getAllReservations();
    observable.subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error.message || 'Failed to load reservations';
        this.loading = false;
      },
    });
  }

  updateStatus(id: number, status: string): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Only administrators can update reservation status';
      return;
    }

    this.reservationService.updateReservationStatus(id, status).subscribe({
      next: (response) => {
        this.successMessage = 'Reservation status updated successfully';
        // Refresh the list to get updated data
        this.loadReservations();
        // Clear success message after 3 seconds
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage =
          error.error.message || 'Failed to update reservation status';
        // Clear error message after 3 seconds
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  cancelReservation(id: number): void {
    const confirmCancel = confirm(
      'Are you sure you want to cancel this reservation?'
    );
    if (!confirmCancel) return;

    this.reservationService.cancelReservation(id).subscribe({
      next: (response) => {
        this.successMessage = 'Reservation cancelled successfully';
        this.loadReservations();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage =
          error.error.message || 'Failed to cancel reservation';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  deleteReservation(id: number): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Only administrators can delete reservations';
      return;
    }

    const confirmDelete = confirm(
      'Are you sure you want to delete this reservation? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    this.reservationService.deleteReservation(id).subscribe({
      next: (response) => {
        this.successMessage = 'Reservation deleted successfully';
        this.loadReservations();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage =
          error.error.message || 'Failed to delete reservation';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  // Format date for better display
  // formatDate(date: string): string {
  //   return this.datePipe.transform(date, 'dd MMM yyyy') || 'N/A';
  // }
}
