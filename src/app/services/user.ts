import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Ajusta según tu API
const API_URL = 'http://localhost:3000/users';

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
}

export interface User {
  id_user: number;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  create(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${API_URL}`, dto);
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}`);
  }

  findOne(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/${id}`);
  }

  update(id: number, dto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${API_URL}/${id}`, dto);
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_URL}/${id}`);
  }
}
