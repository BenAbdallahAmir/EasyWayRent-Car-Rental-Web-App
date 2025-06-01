import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Verify if the user is logged in
    if (this.authService.isLoggedIn()) {
      // Add the token to the request
      request = this.addToken(request, this.authService.getToken() as string);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manage errors
        if (error.status === 401) {
          // logout the user if the token is invalid or expired
          this.authService.logout().subscribe();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }

  private addToken(
    request: HttpRequest<unknown>,
    token: string
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
