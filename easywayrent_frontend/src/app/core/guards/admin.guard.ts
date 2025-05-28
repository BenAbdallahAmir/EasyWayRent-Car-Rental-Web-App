import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkAdminRole();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkAdminRole();
  }

  private checkAdminRole(): boolean | UrlTree {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }

    // Si l'utilisateur est connecté mais n'est pas admin
    if (this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/access-denied']);
    }

    // Si l'utilisateur n'est pas connecté
    return this.router.createUrlTree(['/login']);
  }
}
