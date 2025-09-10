import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarsService {
  private base = '/api';

  constructor(private http: HttpClient) {}


  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/brands`);
  }

  getStores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/stores`);
  }

  getStoresByBrandName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/stores/by-brand/${encodeURIComponent(name)}`);
  }


  getCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/cars`);
  }

  getCar(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/cars/${id}`);
  }

  createCar(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/cars`, payload);
  }

  updateCar(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.base}/cars/${id}`, payload);
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/cars/${id}`);
  }
}