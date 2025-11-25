import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id_product?: number;
  name: string;
  description?: string;
  price: number;
  size: number;
  stock: number;
  category: string;
  image_url?: string;
  is_active?: boolean;
  deleted_at?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000/products';

  /**
   * Obtener todos los productos activos
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.BASE_URL);
  }

  /**
   * Obtener todos los productos, incluyendo los eliminados
   */
  getProductsWithDeleted(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.BASE_URL}/all`);
  }

  /**
   * Obtener un producto por ID (activo)
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Crear un nuevo producto
   */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.BASE_URL, product);
  }

  /**
   * Actualizar un producto existente
   */
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.BASE_URL}/${id}`, product);
  }

  /**
   * Eliminar un producto (soft delete)
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Restaurar un producto eliminado
   */
  restoreProduct(id: number): Observable<Product> {
    return this.http.patch<Product>(`${this.BASE_URL}/${id}/restore`, {});
  }
}
