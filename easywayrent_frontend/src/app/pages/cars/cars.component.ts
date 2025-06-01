import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Car } from '../../../../src/app/models/car';
import { Category } from '../../../../src/app/models/car';
import { AuthService } from '../../core/auth/service/auth.service';
import { CategoryService } from '../../core/services/category/category.service';
import { CarService } from '../../core/services/car/car.service';
import { CommonModule } from '@angular/common';
import { CarsHeaderComponent } from '../../shared/layout/headers/cars-header/cars-header.component';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
  imports: [CommonModule, CarsHeaderComponent, RouterModule, FormsModule],
})
export class CarsComponent implements OnInit {
  cars: Car[] = [];
  categories: Category[] = [];
  filteredCars: Car[] = [];
  uniqueBrands: string[] = [];

  // Filter options
  selectedBrand: string = 'All';
  selectedStatus: string = 'All';
  selectedPriceOrder: string = 'All';

  constructor(
    private carService: CarService,
    private categoryService: CategoryService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCars();
    this.loadCategories();
  }

  loadCars(): void {
    this.carService.getAllCars().subscribe({
      next: (data) => {
        this.cars = data;
        // Ensure each car has access to its category object
        this.cars.forEach((car) => {
          // If car.category is just an ID or doesn't have the full category object
          if (car.category && typeof car.category === 'number') {
            // Find the full category object from our categories array
            const categoryObj = this.categories.find(
              (c) => typeof car.category === 'number' && c.id === car.category
            );
            if (categoryObj) {
              car.category = categoryObj;
            }
          }
        });
        this.filteredCars = [...this.cars];
        this.extractUniqueBrands();
      },
      error: (error) => {
        console.error('Error fetching cars:', error);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        // Now that categories are loaded, load cars to ensure we can assign categories
        if (this.cars.length > 0) {
          this.mapCategoriesToCars();
        }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  mapCategoriesToCars(): void {
    this.cars.forEach((car) => {
      if (car.category && typeof car.category === 'number') {
        const categoryObj = this.categories.find(
          (c) => typeof car.category === 'number' && c.id === car.category
        );
        if (categoryObj) {
          car.category = categoryObj;
        }
      }
    });
    this.filteredCars = [...this.cars];
    this.extractUniqueBrands();
  }

  extractUniqueBrands(): void {
    // Extract unique brands from the cars array
    const brands = this.cars.map((car) => car.brand);
    this.uniqueBrands = [...new Set(brands)].filter((brand) => brand); // Remove any undefined or empty values
  }

  getCategoryName(car: Car): string {
    if (!car.category) return 'N/A';
    if (typeof car.category === 'object' && car.category.name) {
      return car.category.name;
    }
    if (typeof car.category === 'number') {
      const categoryObj = this.categories.find(
        (c) => typeof car.category === 'number' && c.id === car.category
      );
      return categoryObj ? categoryObj.name : 'Unknown';
    }
    return 'N/A';
  }

  applyFilters(): void {
    this.filteredCars = [...this.cars];

    // Filter by brand
    if (this.selectedBrand !== 'All') {
      this.filteredCars = this.filteredCars.filter(
        (car) => car.brand === this.selectedBrand
      );
    }

    // Filter by status
    if (this.selectedStatus !== 'All') {
      const status = this.selectedStatus.toLowerCase();
      this.filteredCars = this.filteredCars.filter(
        (car) => car.status.toLowerCase() === status
      );
    }

    // Sort by price
    if (this.selectedPriceOrder === 'Low to High Price') {
      this.filteredCars.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (this.selectedPriceOrder === 'High to Low Price') {
      this.filteredCars.sort((a, b) => b.price_per_day - a.price_per_day);
    }
  }

  rentNow(carId: number): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/car_details', carId]);
    } else {
      // Store the intended destination for redirect after login
      localStorage.setItem('redirectAfterLogin', `/cars/${carId}`);
      this.router.navigate(['/login']);
    }
  }

  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    event.target.src =
      'https://musee-possen.lu/wp-content/uploads/2020/08/placeholder.png';
  }
}
