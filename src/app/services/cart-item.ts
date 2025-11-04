import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  id?: number;
  cartid: number;      // ID del carrito al que pertenece
  productid: number;   // ID del producto asociado
  quantity: number;
  price: number;
}
export interface CreateCartItemDto {
  cartid: number;
  productid: number;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartItemsService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000/cart-items';

  /**
   * Obtener todos los items del carrito
   */
  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.BASE_URL);
  }

  /**
   * Obtener un item del carrito por su ID
   */
  getCartItemById(id: number): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Crear un nuevo item en el carrito
   */
 createCartItem(dto: CreateCartItemDto): Observable<CartItem> {
  return this.http.post<CartItem>(this.BASE_URL, dto);
}


  /**
   * Actualizar un item del carrito
   */
  updateCartItem(id: number, cartItem: Partial<CartItem>): Observable<CartItem> {
    return this.http.patch<CartItem>(`${this.BASE_URL}/${id}`, cartItem);
  }

  /**
   * Eliminar un item del carrito
   */
  deleteCartItem(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
}
