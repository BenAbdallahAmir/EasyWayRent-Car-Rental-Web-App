import { ReservationsComponent } from './pages/reservations/reservations.component';
import { RegisterComponent } from './pages/register/register.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { Routes } from '@angular/router';

import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LoginComponent } from './pages/login/login.component';
import { CarsComponent } from './pages/cars/cars.component';

import { FrontofficeComponent } from './layouts/frontoffice/frontoffice.component';
import { BackofficeComponent } from './layouts/backoffice/backoffice.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: FrontofficeComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/services/services.component').then(
            (m) => m.ServicesComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
      {
        path: 'cars',
        loadComponent: () =>
          import('./pages/cars/cars.component').then((m) => m.CarsComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'car_details/:id',
        loadComponent: () =>
          import('./pages/car-details/car-details.component').then(
            (m) => m.CarDetailsComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./pages/reservations/reservations.component').then(
            (m) => m.ReservationsComponent
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/cart/cart.component').then((m) => m.CartComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./pages/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'admin',
    component: BackofficeComponent,
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'cars',
        loadComponent: () =>
          import('./pages/admin/cars/cars.component').then(
            (m) => m.CarsComponent
          ),
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./pages/admin/reservations/reservations.component').then(
            (m) => m.ReservationsComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/admin/categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/admin/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then(
        (m) => m.NotfoundComponent
      ),
  },
];
