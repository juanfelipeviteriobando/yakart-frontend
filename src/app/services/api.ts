import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:3000'; // URL de tu API NestJS

  constructor(private http: HttpClient) {}

  // Ejemplo: obtener lista de clientes
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/clientes`);
  }

  // Ejemplo: crear un cliente
  createCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.API_URL}/clientes`, cliente);
  }
}
