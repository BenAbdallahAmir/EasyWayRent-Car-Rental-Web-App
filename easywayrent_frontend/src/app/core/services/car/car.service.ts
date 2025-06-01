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

  // Retrieve all cars
  getAllCars(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cars`);
  }

  // Retrieve cars by their status
  getCarsByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cars/${status}`);
  }

  // Retrieve a car by its ID
  getCarById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/car/${id}`);
  }

  // Add a new car
  addCar(carData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_car`, carData);
  }

  // Update a car
  updateCar(id: number, carData: FormData): Observable<any> {
    carData.append('_method', 'PUT');
    return this.http.post(`${this.apiUrl}/update_car/${id}`, carData);
  }

  // Delete a car
  deleteCar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_car/${id}`);
  }
}
