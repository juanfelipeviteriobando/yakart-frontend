// src/app/services/clientes.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id_client?: number;
  name: string;
  email: string;
  phone: string;
  direction?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000/client';

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.BASE_URL);
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.BASE_URL, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }

  actualizarCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.BASE_URL}/${id}`, cliente);
  }
}
