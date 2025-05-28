import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CartService, CartItem } from '../../core/services/cart/cart.service';
import { AuthService } from '../../core/auth/service/auth.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] | null = null;
  loading: boolean = true;
  selectedCartItem: CartItem | null = null;
  editCartForm: FormGroup;
  minStartDate: string;
  minEndDate: string;
  apiBaseUrl: string = environment.apiUrl;
  private editModal: Modal | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.minStartDate = this.formatDate(today);
    this.minEndDate = this.formatDate(tomorrow);

    this.editCartForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      pickup_location: ['', Validators.required],
      dropoff_location: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/login']);
      return;
    }

    this.loadCartItems();
  }

  // Méthode améliorée pour construire l'URL complète de l'image
  getFullImageUrl(imagePath: string | undefined): string {
    // Si l'image est undefined ou vide, retourner l'image par défaut
    if (!imagePath || imagePath.trim() === '') {
      return 'assets/images/car-placeholder.jpg';
    }

    // Si l'URL est déjà complète (commence par http ou https), la retourner telle quelle
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Nettoyer le chemin d'image pour éviter les doubles slashes
    // Supprimer à la fois les slashes au début du chemin d'image et à la fin de l'URL de base
    const baseUrl = this.apiBaseUrl.endsWith('/')
      ? this.apiBaseUrl.slice(0, -1)
      : this.apiBaseUrl;

    const cleanPath = imagePath.startsWith('/')
      ? imagePath.substring(1)
      : imagePath;

    // Construire l'URL complète
    return `${baseUrl}/storage/${cleanPath}`;
  }

  // Nouvelle méthode pour vérifier explicitement si le panier est vide
  isCartEmpty(): boolean {
    return !this.cartItems || this.cartItems.length === 0;
  }

  loadCartItems(): void {
    this.loading = true;
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = Array.isArray(items) ? items : [];
        this.loading = false;
        // Déboguer les images
        console.log('Cart items loaded:', this.cartItems);
        if (
          this.cartItems &&
          this.cartItems.length > 0 &&
          this.cartItems[0].car
        ) {
          console.log('First car image path:', this.cartItems[0].car.image);
          console.log(
            'Generated image URL:',
            this.getFullImageUrl(this.cartItems[0].car.image)
          );
        }
      },
      error: (error) => {
        this.loading = false;
        this.cartItems = [];
        console.error('Error loading cart items:', error);
        if (error.status === 401) {
          this.authService.logout();
        } else {
          Swal.fire(
            'Error',
            'Failed to load cart items. Please try again.',
            'error'
          );
        }
      },
      complete: () => {
        // S'assurer que loading est mis à false même si l'observable se termine sans émettre de valeur
        this.loading = false;
      },
    });
  }

  removeFromCart(itemId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove the item from your cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(itemId).subscribe({
          next: () => {
            if (this.cartItems) {
              this.cartItems = this.cartItems.filter(
                (item) => item.id !== itemId
              );
            }
            Swal.fire(
              'Removed!',
              'Item has been removed from your cart.',
              'success'
            );
          },
          error: (error) => {
            console.error('Error removing cart item:', error);
            Swal.fire(
              'Error',
              'Failed to remove item from cart. Please try again.',
              'error'
            );
          },
        });
      }
    });
  }

  editCartItem(item: CartItem): void {
    this.selectedCartItem = item;
    this.editCartForm.patchValue({
      start_date: item.start_date,
      end_date: item.end_date,
      pickup_location: item.pickup_location,
      dropoff_location: item.dropoff_location,
    });

    // Using Bootstrap 5 Modal
    const modalElement = document.getElementById('editCartModal');
    if (modalElement) {
      this.editModal = new Modal(modalElement);
      this.editModal.show();
    }
  }

  updateCartItem(): void {
    if (this.editCartForm.invalid || !this.selectedCartItem) {
      return;
    }

    const startDate = new Date(this.editCartForm.get('start_date')?.value);
    const endDate = new Date(this.editCartForm.get('end_date')?.value);

    if (endDate <= startDate) {
      Swal.fire('Invalid Dates', 'End date must be after start date.', 'error');
      return;
    }

    const updateData = this.editCartForm.value;
    this.cartService
      .updateCartItem(this.selectedCartItem.id, updateData)
      .subscribe({
        next: (response) => {
          // Close the modal
          if (this.editModal) {
            this.editModal.hide();
          }

          // Update the local cart item
          if (this.cartItems) {
            const index = this.cartItems.findIndex(
              (item) => item.id === this.selectedCartItem?.id
            );
            if (index !== -1) {
              this.cartItems[index] = response.cart_item;
            }
          }

          Swal.fire('Updated!', 'Cart item has been updated.', 'success');
        },
        error: (error) => {
          console.error('Error updating cart item:', error);
          Swal.fire(
            'Error',
            'Failed to update cart item. Please try again.',
            'error'
          );
        },
      });
  }

  calculateSubtotal(): number {
    if (!this.cartItems || this.cartItems.length === 0) {
      return 0;
    }
    return this.cartItems.reduce((total, item) => total + item.total_price, 0);
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
