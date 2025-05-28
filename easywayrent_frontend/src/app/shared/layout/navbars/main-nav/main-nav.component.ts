import { UserService } from './../../../../core/services/user/user.service';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-main-nav',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.css',
})
export class MainNavComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }



  // onLogin(): void {
  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched();
  //     return;
  //   }

  //   this.userService.login(this.loginForm.value).subscribe({
  //     next: (res) => {
  //       this.userService.setSession(res);
  //       const role = res.user.role;

  //       this.successMessage = 'Successfully logged in';
  //       setTimeout(() => {
  //         this.successMessage = '';
  //       }, 3000);

  //       if (role === 'admin') {
  //         this.router.navigate(['/admin']);
  //       } else {
  //         this.router.navigate(['/cars']);
  //       }
  //     },
  //     error: (err) => {
  //       this.errorMessage = err.error.message;
  //       setTimeout(() => (this.errorMessage = ''), 3000);
  //     },
  //   });
  // }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.userService.register(this.registerForm.value).subscribe({
      next: (res) => {
        // this.userService.setSession(res);
        this.successMessage = 'Account successfully created';

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

        this.router.navigate(['/cars']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Registration failed';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
    });
  }
}
