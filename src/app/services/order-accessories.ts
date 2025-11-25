import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🔹 Interfaz que representa la relación entre una orden personalizada y un accesorio
export interface OrderAccessory {
  id?: number;
  id_order: number;       // ID de la orden personalizada
  id_accessory: number;   // ID del accesorio
}

@Injectable({
  providedIn: 'root'
})
export class OrderAccessoriesService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://10.20.55.118:3000/order-accessories';

  // 🔹 Obtener todas las relaciones orden-accesorio
  getOrderAccessories(): Observable<OrderAccessory[]> {
    return this.http.get<OrderAccessory[]>(this.BASE_URL);
  }

  // 🔹 Obtener una relación por ID
  getOrderAccessoryById(id: number): Observable<OrderAccessory> {
    return this.http.get<OrderAccessory>(`${this.BASE_URL}/${id}`);
  }

  // 🔹 Crear una nueva relación orden-accesorio
  crearOrderAccessory(orderAccessory: OrderAccessory): Observable<OrderAccessory> {
    return this.http.post<OrderAccessory>(this.BASE_URL, orderAccessory);
  }

  // 🔹 Actualizar una relación existente
  actualizarOrderAccessory(id: number, orderAccessory: Partial<OrderAccessory>): Observable<OrderAccessory> {
    return this.http.patch<OrderAccessory>(`${this.BASE_URL}/${id}`, orderAccessory);
  }

  // 🔹 Eliminar una relación orden-accesorio
  eliminarOrderAccessory(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
}
