import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { genericResponse } from '../../Auth/Interfaces/genericResponse';
import { Observable } from 'rxjs';
import { Operador } from '../Interfaces/operador.interface';

@Injectable({
  providedIn: 'root',
})
export class OperadorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/api/'; // Cambia esta URL por la tuya

  constructor() {}

  // Método para obtener el token (puedes modificarlo para obtenerlo desde almacenamiento local o un servicio de autenticación)
  // private getAuthHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('authToken'); // Obtiene el token almacenado
  //   return new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  // }

  // Obtener la lista de usuarios
  getOperadores(): Observable<Operador[]> {
   // const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.get<Operador[]>(this.apiUrl + 'operadores', {
     // headers,
    });
  }
 // Obtener la lista de usuarios
 getOperadorbyId(id: number,): Observable<Operador> {
 // const headers = this.getAuthHeaders(); // Agregar encabezados
  return this.http.get<Operador>(`${this.apiUrl + 'operadores/getOperadorById'}/${id}`, {
  //  headers
  });
}

  // Crear un nuevo usuario
  createOperador(devices: Operador): Observable<Operador> {
   // const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.post<Operador>(this.apiUrl + 'operadores' , devices, {
      //headers
     });
  }

  // Actualizar un usuario existente
  updateOperador(devices: Operador): Observable<Operador> {
  //  const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.put<Operador>(`${this.apiUrl + 'operadores'}`, devices, {
     // headers
    });
  }

  // Eliminar un usuario
  deleteOperador(id: number): Observable<Operador> {
    //const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.delete<Operador>(`${this.apiUrl + 'operadores' }/${id}`, {
      //headers
      });
  }
}
