import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../global';

@Injectable({
  providedIn: 'root',
})
//Servicio para la carga de archivos
export class FilesService {
  private readonly endpoint = `${API_URL}/files/upload`;

  constructor(private http: HttpClient) {}

 uploadFile(formData: FormData): Observable<any> {
  const token = sessionStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.post<any>(this.endpoint, formData, { headers }).pipe(
    catchError((error) => {
      console.error('[FilesService] uploadFile error:', error);

      return throwError(() => ({
        message: 'Error uploading file',
        error,
      }));
    }),
  );
}
}
