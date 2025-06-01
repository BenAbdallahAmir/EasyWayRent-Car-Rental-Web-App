import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category, Car } from './../../../models/car';
import { CarService } from '../../../core/services/car/car.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cars',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css',
})
export class CarsComponent implements OnInit {
  cars: Car[] = [];
  categories: Category[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  addCarForm: FormGroup;
  updateCarForm: FormGroup;

  selectedImageFile: File | null = null;
  selectedCar: Car | null = null;

  currentYear = new Date().getFullYear();

  constructor(
    private carService: CarService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.addCarForm = this.createCarForm();
    this.updateCarForm = this.createCarForm();
  }

  ngOnInit(): void {
    this.loadCars();
    this.loadCategories();
  }

  createCarForm(): FormGroup {
    return this.fb.group({
      category_id: ['', Validators.required],
      model: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', [Validators.required, Validators.minLength(3)]],
      doors: [2, [Validators.required, Validators.min(2)]],
      luggage: [0, [Validators.required, Validators.min(0)]],
      passengers: [2, [Validators.required, Validators.min(2)]],
      year: [
        this.currentYear,
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(this.currentYear),
        ],
      ],
      status: ['available', Validators.required],
      price_per_day: [0, [Validators.required, Validators.min(0)]],
      license_plate: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  loadCars(): void {
    this.loading = true;
    this.carService.getAllCars().subscribe({
      next: (data) => {
        this.cars = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading cars: ' + error.message;
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        this.errorMessage = 'Error loading categories: ' + error.message;
      },
    });
  }

  filterByStatus(status: string | null): void {
    this.loading = true;
    if (status) {
      this.carService.getCarsByStatus(status).subscribe({
        next: (data) => {
          this.cars = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error filtering cars: ' + error.message;
          this.loading = false;
        },
      });
    } else {
      this.loadCars();
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];
    }
  }

  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    event.target.src =
      'https://musee-possen.lu/wp-content/uploads/2020/08/placeholder.png';
  }

  // Verify if the URL is a valid image URL
  isValidImageUrl(url: string): boolean {
    return !!url && (url.startsWith('http://') || url.startsWith('https://'));
  }

  addCar(): void {
    if (this.addCarForm.invalid || !this.selectedImageFile) {
      return;
    }

    this.loading = true;
    const formData = new FormData();

    Object.keys(this.addCarForm.value).forEach((key) => {
      formData.append(key, this.addCarForm.value[key]);
    });

    formData.append('image', this.selectedImageFile);

    this.carService.addCar(formData).subscribe({
      next: (response) => {
        this.loadCars();
        this.resetForm();
        // Close the modal
        document.getElementById('closeAddModal')?.click();
        this.successMessage = 'Car added successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Error adding car: ' + error.message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
        this.loading = false;
      },
    });
  }

  updateCar(car: Car): void {
    this.selectedCar = car;
    this.updateCarForm.patchValue({
      category_id: car.category_id,
      model: car.model,
      brand: car.brand,
      doors: car.doors,
      luggage: car.luggage,
      passengers: car.passengers,
      year: car.year,
      status: car.status,
      price_per_day: car.price_per_day,
      license_plate: car.license_plate,
      description: car.description || '',
    });
  }

  submitUpdateCar(): void {
    if (this.updateCarForm.invalid || !this.selectedCar) {
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // Add all form values to FormData
    Object.keys(this.updateCarForm.value).forEach((key) => {
      formData.append(key, this.updateCarForm.value[key]);
    });

    // Add the selected image file if it exists
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.carService.updateCar(this.selectedCar.id, formData).subscribe({
      next: (response) => {
        this.loadCars();
        // Close the modal
        document.getElementById('closeUpdateModal')?.click();
        this.successMessage = 'Car updated successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error updating car: ' + error.message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
        this.loading = false;
      },
    });
  }

  deleteCar(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--bs-primary)',
      cancelButtonColor: 'var(--bs-secondary)',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.carService.deleteCar(id).subscribe({
          next: (response) => {
            this.loadCars();
            Swal.fire('Deleted!', 'Car has been deleted.', 'success');
          },
          error: (error) => {
            Swal.fire('Error!', this.errorMessage, 'error');
            this.loading = false;
          },
        });
      }
    });
  }

  resetForm(): void {
    this.addCarForm.reset({
      status: 'available',
      doors: 2,
      passengers: 2,
      luggage: 0,
      year: this.currentYear,
      price_per_day: 0,
    });
    this.selectedImageFile = null;
    this.successMessage = '';
    this.errorMessage = '';
  }
}
