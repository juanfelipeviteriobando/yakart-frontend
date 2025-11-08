import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Accessory {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccessoriesService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000/accessory';

  getAccessories(): Observable<Accessory[]> {
    return this.http.get<Accessory[]>(this.BASE_URL);
  }

  getAccessoryById(id: number): Observable<Accessory> {
    return this.http.get<Accessory>(`${this.BASE_URL}/${id}`);
  }

  createAccessory(accessory: Partial<Accessory>): Observable<Accessory> {
    return this.http.post<Accessory>(this.BASE_URL, accessory);
  }

  updateAccessory(id: number, accessory: Partial<Accessory>): Observable<Accessory> {
    return this.http.patch<Accessory>(`${this.BASE_URL}/${id}`, accessory);
  }

  deleteAccessory(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
}
