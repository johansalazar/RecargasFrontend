import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendedor } from '../Interfaces/vendedor.interface';

@Injectable({
  providedIn: 'root',
})
export class VendedorService {
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
  getVendedores(): Observable<Vendedor[]> {
    // const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.get<Vendedor[]>(this.apiUrl + 'vendedores', {
      // headers,
    });
  }
  // Obtener la lista de usuarios
  getVendedorbyId(id: number): Observable<Vendedor> {
    // const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.get<Vendedor>(
      `${this.apiUrl + 'vendedores/getVendedorById'}/${id}`,
      {
        //  headers
      }
    );
  }

  // Crear un nuevo usuario
  createVendedor(devices: Vendedor): Observable<Vendedor> {
    // const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.post<Vendedor>(this.apiUrl + 'vendedores', devices, {
      //headers
    });
  }

  // Actualizar un usuario existente
  updateVendedor(devices: Vendedor): Observable<Vendedor> {
    //  const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.put<Vendedor>(`${this.apiUrl + 'vendedores'}`, devices, {
      // headers
    });
  }

  // Eliminar un usuario
  deleteVendedor(id: number): Observable<Vendedor> {
    //const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.delete<Vendedor>(`${this.apiUrl + 'vendedores'}/${id}`, {
      //headers
    });
  }
}
