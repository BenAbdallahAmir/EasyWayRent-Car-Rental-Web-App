import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CarService } from '../../core/services/car/car.service';
import { AuthService } from '../../core/auth/service/auth.service';
import { Car } from '../../../../src/app/models/car';
import Swal from 'sweetalert2';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class CarDetailsComponent implements OnInit {
  car: Car | null = null;
  reservationForm: FormGroup;
  loading = false;
  minStartDate: string;
  minEndDate: string;
  totalPrice = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cartService: CartService
  ) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.minStartDate = this.formatDate(today);
    this.minEndDate = this.formatDate(tomorrow);

    this.reservationForm = this.fb.group({
      start_date: [this.minStartDate, Validators.required],
      end_date: [this.minEndDate, Validators.required],
      pickup_location: ['', Validators.required],
      dropoff_location: ['', Validators.required],
      payment_method: ['credit_card', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/login']);
      return;
    }

    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadCarDetails(+carId);
    } else {
      this.router.navigate(['/cars']);
    }

    this.reservationForm
      .get('start_date')
      ?.valueChanges.subscribe(() => this.calculateTotalPrice());
    this.reservationForm
      .get('end_date')
      ?.valueChanges.subscribe(() => this.calculateTotalPrice());
  }

  loadCarDetails(carId: number): void {
    this.loading = true;
    this.carService.getCarById(carId).subscribe({
      next: (car) => {
        this.car = car;
        this.loading = false;
        this.calculateTotalPrice();
      },
      error: (error) => {
        console.error('Error loading car details:', error);
        Swal.fire('Error', 'Failed to load car details.', 'error');
        this.loading = false;
        this.router.navigate(['/cars']);
      },
    });
  }

  calculateTotalPrice(): void {
    if (!this.car) return;

    const startDate = new Date(this.reservationForm.get('start_date')?.value);
    const endDate = new Date(this.reservationForm.get('end_date')?.value);

    if (startDate && endDate && endDate > startDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.totalPrice = diffDays * this.car.price_per_day;
    } else {
      this.totalPrice = 0;
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  submitToCart(): void {
    if (this.reservationForm.invalid || !this.car) {
      this.reservationForm.markAllAsTouched();
      Swal.fire(
        'Validation Error',
        'Please fill in all required fields correctly.',
        'error'
      );
      return;
    }

    const startDate = new Date(this.reservationForm.get('start_date')?.value);
    const endDate = new Date(this.reservationForm.get('end_date')?.value);

    if (endDate <= startDate) {
      Swal.fire('Invalid Dates', 'End date must be after start date.', 'error');
      return;
    }

    this.loading = true;

    const cartData = {
      car_id: this.car.id,
      start_date: this.reservationForm.get('start_date')?.value,
      end_date: this.reservationForm.get('end_date')?.value,
      pickup_location: this.reservationForm.get('pickup_location')?.value,
      dropoff_location: this.reservationForm.get('dropoff_location')?.value,
    };

    this.cartService.addToCart(cartData).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire(
          'Success',
          response.message || 'Car added to cart!',
          'success'
        ).then(() => {
          this.router.navigate(['/cart']);
        });
      },
      error: (error) => {
        this.loading = false;
        let errorMessage = 'Failed to add to cart. Please try again.';
        if (error.status === 400) {
          errorMessage =
            error.error.message || 'Invalid cart data or car not available.';
          if (error.error.errors) {
            errorMessage = Object.values(error.error.errors).flat().join(' ');
          }
        } else if (error.status === 401) {
          errorMessage = 'Please log in to add items to your cart.';
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        Swal.fire('Error', errorMessage, 'error');
      },
    });
  }
}
