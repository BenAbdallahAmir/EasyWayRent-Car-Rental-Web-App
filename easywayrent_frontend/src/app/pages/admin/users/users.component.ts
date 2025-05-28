import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  userForm: FormGroup;
  selectedUserId: number | null = null;
  isEditMode = false;

  // Filtre
  currentFilter: 'all' | 'admin' | 'client' = 'all';

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: [
        '',
        [Validators.required, Validators.pattern('^[0-9+\\s-]{8,15}$')],
      ],
      password: ['', [Validators.minLength(6)]],
      role: ['client', Validators.required],
    });
  }

  loadUsers(): void {
    this.loading = true;

    let observable;
    switch (this.currentFilter) {
      case 'admin':
        observable = this.userService.getAdmins();
        break;
      case 'client':
        observable = this.userService.getClients();
        break;
      default:
        observable = this.userService.getAllUsers();
        break;
    }

    observable.subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading users: ' + error.message;
        this.loading = false;
      },
    });
  }

  filterUsers(filter: 'all' | 'admin' | 'client'): void {
    this.currentFilter = filter;
    this.loadUsers();
  }

  openAddUserModal(): void {
    this.isEditMode = false;
    this.userForm.reset();
    this.userForm.patchValue({ role: 'client' });
    // Ajoutez ici le code pour ouvrir le modal (utilisez Bootstrap ou autre méthode)
  }

  openEditUserModal(user: User): void {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      role: user.role,
      // Ne pas précharger le mot de passe
    });
    // Le champ password est optionnel lors de l'édition
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();

    // Ajoutez ici le code pour ouvrir le modal (utilisez Bootstrap ou autre méthode)
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    const userData = this.userForm.value;

    if (this.isEditMode && this.selectedUserId) {
      // Si le mot de passe est vide, le supprimer de l'objet
      if (!userData.password) {
        delete userData.password;
      }

      this.userService.updateUser(this.selectedUserId, userData).subscribe({
        next: (response) => {
          this.loadUsers();
          this.closeModal();

          this.successMessage = 'User updated successfully!';
          setTimeout(() => (this.successMessage = ''), 3000);
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error updating user: ' + error.message;
          setTimeout(() => (this.errorMessage = ''), 3000);
          this.loading = false;
        },
      });
    } else {
      // Assurez-vous que le mot de passe est requis pour un nouvel utilisateur
      if (!userData.password) {
        this.errorMessage = 'Password is required for new users';
        setTimeout(() => (this.errorMessage = ''), 3000);
        this.loading = false;
        return;
      }

      this.userService.register(userData).subscribe({
        next: (response) => {
          this.loadUsers();
          this.closeModal();

          this.successMessage = 'User added successfully!';
          setTimeout(() => (this.successMessage = ''), 3000);
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error adding user: ' + error.message;
          setTimeout(() => (this.errorMessage = ''), 3000);
          this.loading = false;
        },
      });
    }
  }

  deleteUser(userId: number): void {
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
        this.userService.deleteUser(userId).subscribe({
          next: (response) => {
            this.loadUsers();
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            this.loading = false;
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'Failed to delete user: ' + error.message,
              'error'
            );
            this.loading = false;
          },
        });
      }
    });
  }

  promoteToAdmin(userId: number): void {
    Swal.fire({
      title: 'Promote to Admin?',
      text: 'This will give the user full administrative privileges',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--bs-primary)',
      cancelButtonColor: 'var(--bs-secondary)',
      confirmButtonText: 'Yes, promote!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.userService.promoteToAdmin(userId).subscribe({
          next: (response) => {
            this.loadUsers();
            Swal.fire(
              'Promoted!',
              'User has been promoted to admin.',
              'success'
            );
            this.loading = false;
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'Failed to promote user: ' + error.message,
              'error'
            );
            this.loading = false;
          },
        });
      }
    });
  }

  closeModal(): void {
    // Code pour fermer le modal (utilisez l'élément DOM ou autre méthode selon votre configuration)
    document.getElementById('closeUserModal')?.click();
    this.userForm.reset();
    this.selectedUserId = null;
    this.isEditMode = false;
  }
}
