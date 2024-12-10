import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { User } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7159/api/v1/'; // Cambia esta URL por la tuya

  constructor() {}

  // Método para obtener el token (puedes modificarlo para obtenerlo desde almacenamiento local o un servicio de autenticación)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtiene el token almacenado
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener la lista de usuarios
  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.get<User[]>(this.apiUrl + 'Users/GetAllUsers', {
      headers,
    });
  }
 // Obtener la lista de usuarios
 getUserbyId(id: string,): Observable<User> {
  const headers = this.getAuthHeaders(); // Agregar encabezados
  return this.http.get<User>(`${this.apiUrl + 'Users/GetUserById'}/${id}`, { headers });
}

  // Crear un nuevo usuario
  createUser(user: User): Observable<User> {
    const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.post<User>(this.apiUrl + 'Users/AddUser' , user, { headers });
  }

  // Actualizar un usuario existente
  updateUser(id: string, user: User): Observable<User> {
    const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.put<User>(`${this.apiUrl + 'Users/UpdateUser'}/${id}`, user, { headers });
  }

  // Eliminar un usuario
  deleteUser(id: string): Observable<void> {
    const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.delete<void>(`${this.apiUrl + 'Users/DeleteUser' }/${id}`, { headers });
  }
}
