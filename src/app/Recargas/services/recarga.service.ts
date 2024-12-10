import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Recarga } from '../Interfaces/recarga.interface';

@Injectable({
  providedIn: 'root'
})
export class RecargaService { private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/api/'; // Cambia esta URL por la tuya

  constructor() {}

  // Método para obtener el token (puedes modificarlo para obtenerlo desde almacenamiento local o un servicio de autenticación)
  // private getAuthHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('authToken'); // Obtiene el token almacenado
  //   return new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  // }

  // Obtener la lista de recargas
  getRecarga(): Observable<Recarga[]> {
   // const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.get<Recarga[]>(this.apiUrl + 'recargas', {
     // headers,
    });
  }
 // Obtener la lista de recargas
 getRecargabyId(id: number,): Observable<Recarga> {
 // const headers = this.getAuthHeaders(); // Agregar encabezados
  return this.http.get<Recarga>(`${this.apiUrl + 'recargas/getRecargaById'}/${id}`, {
  //  headers
  });
}

  // Crear un nuevo recarga
  createRecarga(devices: Recarga): Observable<Recarga> {
   // const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.post<Recarga>(this.apiUrl + 'recargas' , devices, {
      //headers
     });
  }


  // Eliminar un recarga
  deleteRecarga(id: number): Observable<Recarga> {
    //const headers = this.getAuthHeaders(); // Agregar encabezados
    return this.http.delete<Recarga>(`${this.apiUrl + 'recargas' }/${id}`, {
      //headers
      });
  }

    // Método para obtener el último ID de RECARGAS
    getLastRecargaId(): Observable<number> {
      return this.getRecarga().pipe(
        map((recargas: Recarga[]) => {
          // Extraer el último ID de la lista de recargas
          return recargas.reduce((maxId, recarga) => Math.max(maxId, recarga.id), 0);
        })
      );
    }
}
