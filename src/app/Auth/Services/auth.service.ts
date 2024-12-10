import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../Interfaces/AuthResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'authToken';
  private readonly usernameKey = 'username';
  private readonly apiUrl = 'https://localhost:7159/api/v1/';

  constructor(private http: HttpClient) {}

  // Iniciar sesión
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Auth/Login`, {
      email,
      password,
    });
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem(this.tokenKey);
      return !!token; // Devuelve true si el token existe
    }
    return false; // Retorna false si no estás en un navegador
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(this.tokenKey);
    }
  }
  // Obtener el nombre del usuario
  getUserName(): string {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('username') || 'Invitado';
    }
    return 'Invitado';
  }

  // Guardar el nombre del usuario
  setUserName(username: string): void {
    if (username && username.trim()) {
      localStorage.setItem(this.usernameKey, username);
    } else {
      console.warn('El nombre de usuario no es válido.');
    }
  }
}
