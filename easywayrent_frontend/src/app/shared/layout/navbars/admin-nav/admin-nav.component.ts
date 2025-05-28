import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../../../core/auth/service/auth.service';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css'],
})
export class AdminNavComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur actuel au chargement du composant
    this.currentUser = this.authService.getCurrentUser();

    // S'abonner aux changements d'état de l'utilisateur
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      // Rediriger vers la page de connexion si l'utilisateur n'est pas admin
      if (user && user.role !== 'admin') {
        this.router.navigate(['/login']);
      }
    });

    // Vérifier si l'utilisateur est admin, sinon rediriger
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Error while logging out', error);
        this.router.navigate(['/login']);
      },
    });
  }
}
