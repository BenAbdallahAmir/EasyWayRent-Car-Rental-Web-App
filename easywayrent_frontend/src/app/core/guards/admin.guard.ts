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

    //if user is logged in but not admin, redirect to access denied page
    if (this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/access-denied']);
    }

    //if user is not logged in, redirect to login page
    return this.router.createUrlTree(['/login']);
  }
}
