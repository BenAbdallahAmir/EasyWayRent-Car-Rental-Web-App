import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../../core/services/category/category.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-categories',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  selectedCategoryId: number | null = null;
  addCatForm!: FormGroup;
  updateCatForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchCategories();
  }

  initForm() {
    this.addCatForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
     this.updateCatForm = this.fb.group({
       name: ['', [Validators.required, Validators.minLength(3)]],
     });
  }

  fetchCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res),
    });
  }

  // onSubmit() {
  //   if (this.categoryForm.invalid) return;

  //   const formData = this.categoryForm.value;

  //   if (this.selectedCategoryId) {
  //     this.categoryService
  //       .updateCategory(this.selectedCategoryId, formData)
  //       .subscribe({
  //         next: (res) => {
  //           this.successMessage = 'Category has been updated successfully';
  //           this.fetchCategories();

  //           setTimeout(() => {
  //             this.successMessage = '';
  //             this.resetForm();
  //           }, 3000);
  //         },
  //         error: (err) => {
  //           this.errorMessage = err.error.message;
  //           setTimeout(() => (this.errorMessage = ''), 4000);
  //         },
  //       });
  //   } else {
  //     this.categoryService.createCategory(formData).subscribe({
  //       next: (res) => {
  //         this.successMessage = 'Category has been added successfully';
  //         this.fetchCategories();

  //         setTimeout(() => {
  //           this.successMessage = '';
  //           this.resetForm();
  //         }, 3000);
  //       },
  //       error: (err) => {
  //         this.errorMessage = err.error.message;
  //         setTimeout(() => (this.errorMessage = ''), 4000);
  //       },
  //     });
  //   }
  // }

  updateCategory(cat: any) {
    this.selectedCategoryId = cat.id;
    this.updateCatForm.patchValue({ name: cat.name });
  }
  submitUpdate() {
    if (this.updateCatForm.invalid) return;
    const formData = this.updateCatForm.value;

    if (this.selectedCategoryId) {
      this.categoryService
        .updateCategory(this.selectedCategoryId, formData)
        .subscribe({
          next: (res) => {
            this.successMessage = 'Category has been updated successfully';
            this.fetchCategories();

            setTimeout(() => {
              this.successMessage = '';
              this.resetUpdateForm();
            }, 3000);
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            setTimeout(() => (this.errorMessage = ''), 3000);
          },
        });
    }
  }

  addCat() {
 if (this.addCatForm.invalid) return;

 const formData = this.addCatForm.value;

  this.categoryService.addCategory(formData).subscribe({
    next: (res) => {
      this.successMessage = 'Category has been added successfully';
      this.fetchCategories();

      setTimeout(() => {
        this.successMessage = '';
        this.resetAddForm();
      }, 3000);
    },
    error: (err) => {
      this.errorMessage = err.error.message;
      setTimeout(() => (this.errorMessage = ''), 3000);
    },
  });
}

  deleteCategory(id: number) {
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
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.fetchCategories();
            Swal.fire(
              'Deleted!',
              'Category has been deleted successfully',
              'success'
            );
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            setTimeout(() => (this.errorMessage = ''), 4000);
          },
        });
      }
    });
  }

  resetUpdateForm() {
    this.selectedCategoryId = null;
    this.updateCatForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
  resetAddForm() {
    this.selectedCategoryId = null;
    this.addCatForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
