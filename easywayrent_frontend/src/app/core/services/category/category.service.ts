import { Category } from './../../../models/car';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Retrieve all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories_list`);
  }

  // Retrieve a category by its ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/category/${id}`);
  }

  // Add a category
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create_category`, category);
  }

  // Update a category
  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_category/${id}`, category);
  }

  // Delete a category
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_category/${id}`);
  }
}
