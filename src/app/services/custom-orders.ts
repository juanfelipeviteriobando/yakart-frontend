import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🔹 Interfaz que representa una orden personalizada
export interface CustomOrder {
  id_order?: number;
  id_client: number;
  id_sale?: number | null;
  description: string;
  application_date?: Date;
  delivery_date: Date;
  status?: string;
  price?: number;
  image_url?: string | null;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomOrdersService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000/custom-orders';

  // 🔹 Obtener todas las órdenes personalizadas
  getCustomOrders(): Observable<CustomOrder[]> {
    return this.http.get<CustomOrder[]>(this.BASE_URL);
  }

  // 🔹 Obtener una orden por ID
  getCustomOrderById(id: number): Observable<CustomOrder> {
    return this.http.get<CustomOrder>(`${this.BASE_URL}/${id}`);
  }
  
  // 🔹 Crear una nueva orden personalizada
  crearCustomOrder(order: CustomOrder): Observable<CustomOrder> {
    return this.http.post<CustomOrder>(this.BASE_URL, order);
  }

  // 🔹 Actualizar una orden personalizada
  actualizarCustomOrder(id: number, order: Partial<CustomOrder>): Observable<CustomOrder> {
    return this.http.patch<CustomOrder>(`${this.BASE_URL}/${id}`, order);
  }

  // 🔹 Eliminar una orden personalizada
  eliminarCustomOrder(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
}
