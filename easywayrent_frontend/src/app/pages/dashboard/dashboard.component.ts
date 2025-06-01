import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarService } from '../../core/services/car/car.service';
import { ReservationService } from '../../core/services/reservation/reservation.service';
import { UserService } from '../../core/services/user/user.service';
import { CategoryService } from '../../core/services/category/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule],
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // General statistics
  totalCars: number = 0;
  availableCars: number = 0;
  totalReservations: number = 0;
  activeReservations: number = 0;
  completedReservations: number = 0;
  pendingReservations: number = 0;
  totalUsers: number = 0;
  totalAdmins: number = 0;
  totalRevenue: number = 0;
  completedRevenue: number = 0;
  totalCategories: number = 0;
  mostPopularCategory: string = 'N/A';

  // Loading state
  loading: boolean = true;
  error: string | null = null;

  // Data for charts (if we want to add them later)
  reservationsByMonth: any[] = [];
  revenueByMonth: any[] = [];
  categoryRentals: { [key: string]: number } = {};

  constructor(
    private carService: CarService,
    private reservationService: ReservationService,
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      allCars: this.carService.getAllCars(),
      availableCars: this.carService.getCarsByStatus('available'),
      allReservations: this.reservationService.getAllReservations(),
      clients: this.userService.getClients(),
      admins: this.userService.getAdmins(),
      categories: this.categoryService.getAllCategories(),
    }).subscribe({
      next: (results) => {
        // Calculate basic statistics
        this.totalCars = results.allCars.length;
        this.availableCars = results.availableCars.length;
        this.totalReservations = results.allReservations.length;
        this.totalUsers = results.clients.length;
        this.totalAdmins = results.admins.length;
        this.totalCategories = results.categories.length;

        // Process reservation statistics
        const reservations = results.allReservations;

        // Filter active reservations (neither cancelled nor completed)
        this.activeReservations = reservations.filter(
          (res) => res.status !== 'cancelled' && res.status !== 'completed'
        ).length;

        // Completed reservations
        this.completedReservations = reservations.filter(
          (res) => res.status === 'completed'
        ).length;

        // Pending reservations
        this.pendingReservations = reservations.filter(
          (res) => res.status === 'pending'
        ).length;

        // Calculate total revenue (excluding cancelled reservations)
        this.totalRevenue = reservations
          .filter((res) => res.status !== 'cancelled')
          .reduce((sum, res) => sum + res.total_price, 0);

        // Calculate revenue from completed reservations
        this.completedRevenue = reservations
          .filter((res) => res.status === 'completed')
          .reduce((sum, res) => sum + res.total_price, 0);

        // Analyze the most popular categories
        this.analyzeMostPopularCategory(
          reservations,
          results.allCars,
          results.categories
        );

        // Prepare data for charts if necessary
        this.prepareChartData(reservations);

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading dashboard data';
        console.error('Dashboard data loading error', err);
        this.loading = false;
      },
    });
  }

  analyzeMostPopularCategory(
    reservations: any[],
    cars: any[],
    categories: any[]
  ): void {
    // Create a mapping of cars to their categories
    const carCategoryMap: { [key: number]: number } = {};
    cars.forEach((car) => {
      if (car.category_id) {
        carCategoryMap[car.id] = car.category_id;
      }
    });

    // Create a mapping of category IDs to their names
    const categoryNameMap: { [key: number]: string } = {};
    categories.forEach((category) => {
      categoryNameMap[category.id] = category.name;
    });

    // Count reservations by category
    const categoryCount: { [key: number]: number } = {};

    reservations
      .filter((res) => res.status !== 'cancelled') // Exclude cancelled reservations
      .forEach((res) => {
        const carId = res.car_id;
        const categoryId = carCategoryMap[carId];

        if (categoryId) {
          categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
        }
      });

    // Find the most popular category
    let maxCount = 0;
    let popularCategoryId = null;

    Object.keys(categoryCount).forEach((categoryId) => {
      const count = categoryCount[Number(categoryId)];
      if (count > maxCount) {
        maxCount = count;
        popularCategoryId = Number(categoryId);
      }
    });

    // Set the most popular category
    this.mostPopularCategory =
      popularCategoryId && categoryNameMap[popularCategoryId]
        ? categoryNameMap[popularCategoryId]
        : 'N/A';
  }

  prepareChartData(reservations: any[]): void {
    // Create monthly statistics for charts
    const monthlyData: { [key: string]: any } = {};

    reservations.forEach((res) => {
      if (res.status === 'cancelled') return;

      const date = new Date(res.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: this.getMonthName(date.getMonth()),
          count: 0,
          revenue: 0,
        };
      }

      monthlyData[monthKey].count++;
      monthlyData[monthKey].revenue += res.total_price;
    });

    // Convert to arrays for charts
    this.reservationsByMonth = Object.values(monthlyData).map((item) => ({
      name: item.month,
      value: item.count,
    }));

    this.revenueByMonth = Object.values(monthlyData).map((item) => ({
      name: item.month,
      value: item.revenue,
    }));
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[monthIndex];
  }

  // Format numbers for display
  formatNumber(num: number): string {
    return num.toLocaleString('fr-TN');
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('fr-TN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }
}
