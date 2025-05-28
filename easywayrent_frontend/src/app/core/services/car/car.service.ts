import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Car } from '../../../models/car';


@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les voitures
  getAllCars(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cars`);
  }

  // Récupérer les voitures selon leur statut
  getCarsByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cars/${status}`);
  }

  // Récupérer une voiture par son ID
  getCarById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/car/${id}`);
  }

  // Ajouter une nouvelle voiture
  addCar(carData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_car`, carData);
  }

  // Mettre à jour une voiture
  updateCar(id: number, carData: FormData): Observable<any> {
    carData.append('_method', 'PUT');
    return this.http.post(`${this.apiUrl}/update_car/${id}`, carData);
  }

  // Supprimer une voiture
  deleteCar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_car/${id}`);
  }
}
