import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../global';
import { PartnershipListResponse } from '../interfaces/partnership-list-response';
import { PartnershipResponse } from '../interfaces/partnership-response';
import { PartnershipRequest } from '../interfaces/partnership-request';

@Injectable({
  providedIn: 'root',
})
//Servicio para los convenios
export class PartnershipService {
  private readonly endpoint = `${API_URL}/partnership`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  //Obtener los convenios
  getPartnerships(
    page: number,
    universityId?: number,
    companyId?: number,
  ): Observable<PartnershipListResponse> {
    let params = new HttpParams().set('page', page);

    if (universityId !== undefined) {
      params = params.set('universityId', universityId);
    }

    if (companyId !== undefined) {
      params = params.set('companyId', companyId);
    }

    return this.http
      .get<PartnershipListResponse>(this.endpoint, {
        headers: this.getHeaders(),
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('[PartnershipService] getPartnerships error:', error);

          return throwError(() => ({
            message: 'Error fetching partnerships',
            error,
          }));
        }),
      );
  }
  //Crear un convenio
  createPartnership(data: PartnershipRequest): Observable<PartnershipResponse> {
    return this.http
      .post<PartnershipResponse>(this.endpoint, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[PartnershipService] createPartnership error:', error);

          return throwError(() => ({
            message: 'Error creating partnership',
            error,
          }));
        }),
      );
  }
  //Actualizar un convenio
  updatePartnership(
    id: number,
    data: Partial<PartnershipRequest>,
  ): Observable<PartnershipResponse> {
    return this.http
      .patch<PartnershipResponse>(`${this.endpoint}/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[PartnershipService] updatePartnership error:', error);

          return throwError(() => ({
            message: 'Error updating partnership',
            error,
          }));
        }),
      );
  }
  //Eliminar un convenio
  deletePartnership(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[PartnershipService] deletePartnership error:', error);

          return throwError(() => ({
            message: 'Error deleting partnership',
            error,
          }));
        }),
      );
  }
}
