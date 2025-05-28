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

  // Récupérer toutes les catégories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories_list`);
  }

  // Récupérer une catégorie par son ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/category/${id}`);
  }

  // Ajouter une catégorie
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create_category`, category);
  }

  // Mettre à jour une catégorie
  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_category/${id}`, category);
  }

  // Supprimer une catégorie
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_category/${id}`);
  }
}
