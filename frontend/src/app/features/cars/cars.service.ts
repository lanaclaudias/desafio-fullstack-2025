import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = '/api';

@Injectable({ providedIn: 'root' })
export class CarsService {
  constructor(private http: HttpClient) {}

  getBrands(): Observable<any> { return this.http.get(`${BASE}/brands`); }
  getStores(): Observable<any> { return this.http.get(`${BASE}/stores`); }
  getStoresByBrand(name: string): Observable<any> { return this.http.get(`${BASE}/stores/by-brand/${encodeURIComponent(name)}`); }

  getCars(): Observable<any> { return this.http.get(`${BASE}/cars`); }
  getCar(id: number): Observable<any> { return this.http.get(`${BASE}/cars/${id}`); }
  createCar(payload: any): Observable<any> { return this.http.post(`${BASE}/cars`, payload); }
  updateCar(id: number, payload: any): Observable<any> { return this.http.put(`${BASE}/cars/${id}`, payload); }
  deleteCar(id: number): Observable<any> { return this.http.delete(`${BASE}/cars/${id}`); }
}
