import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/auth/service/auth.service';
import { UserService } from '../../core/services/user/user.service';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  passwordForm: FormGroup;
  showPasswordForm = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userFromAuth = this.authService.getCurrentUser();
    if (userFromAuth) {
      this.currentUser = {
        ...userFromAuth,
        role:
          userFromAuth.role === 'admin' || userFromAuth.role === 'client'
            ? userFromAuth.role
            : 'client',
      };
    } else {
      this.currentUser = null;
    }

    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        address: this.currentUser.address,
      });
    } else {
      // If the user is not logged in, redirect to the login page
      this.router.navigate(['/login']);
    }
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isEditing) {
      // If exiting edit mode, reset the form
      this.loadUserProfile();
    }
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    if (!this.showPasswordForm) {
      this.passwordForm.reset();
    }
    this.errorMessage = '';
    this.successMessage = '';
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const profileData = {
        ...this.profileForm.value,
      };

      // Use the user service to update the profile
      this.userService
        .updateUser(this.currentUser.id, profileData)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.errorMessage =
              error.error?.message ||
              'Error while updating profile.';
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((response) => {
          if (response) {
            this.successMessage = 'Profile updated successfully!';

            // Update the local user with the new information
            if (this.currentUser && response.user) {
              this.currentUser = response.user;

              // Update the user in localStorage via AuthService
              const token = this.authService.getToken();
              if (token) {
                this.authService.updateUserInfo(response.user);
              }
            }

            this.isEditing = false;
          }
        });
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const passwordData = {
        current_password: this.passwordForm.value.currentPassword,
        password: this.passwordForm.value.newPassword,
        password_confirmation: this.passwordForm.value.confirmPassword,
      };

      // Use the updatePassword method from AuthService
      this.authService
        .updatePassword(passwordData)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.errorMessage =
              error.error?.message ||
              'Error while updating password.';
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((response) => {
          if (response) {
            this.successMessage = 'Password updated successfully!';
            this.passwordForm.reset();
            this.showPasswordForm = false;
          }
        });
    }
  }
}
