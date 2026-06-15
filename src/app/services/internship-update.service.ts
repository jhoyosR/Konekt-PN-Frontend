import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_URL } from '../../global';

import { InternshipUpdateRequest } from '../interfaces/internship-update-request';
import { InternshipUpdateResponse } from '../interfaces/internship-update-response';
import { InternshipUpdateListResponse } from '../interfaces/internship-update-list-response';

@Injectable({
  providedIn: 'root',
})
//Servicio para los seguimientos de las prácticas
export class InternshipUpdateService {
  private readonly endpoint = `${API_URL}/internship-update`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  //Obtener los seguimientos
  getInternshipUpdates(params?: {
    page?: number;
    internshipId?: number;
  }): Observable<InternshipUpdateListResponse> {
    let httpParams = new HttpParams();

    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page);
    }

    if (params?.internshipId !== undefined) {
      httpParams = httpParams.set('internshipId', params.internshipId);
    }

    return this.http
      .get<InternshipUpdateListResponse>(this.endpoint, {
        headers: this.getHeaders(),
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Obtener un seguimiento por id
  getInternshipUpdateById(id: number): Observable<InternshipUpdateResponse> {
    return this.http
      .get<InternshipUpdateResponse>(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  //Crear un seguimiento
  createInternshipUpdate(
    data: InternshipUpdateRequest,
  ): Observable<InternshipUpdateResponse> {
    return this.http
      .post<InternshipUpdateResponse>(this.endpoint, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  //Actualizar un seguimiento
  updateInternshipUpdate(
    id: number,
    data: Partial<InternshipUpdateRequest>,
  ): Observable<InternshipUpdateResponse> {
    return this.http
      .patch<InternshipUpdateResponse>(`${this.endpoint}/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  //Eliminar un seguimiento
  deleteInternshipUpdate(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('[InternshipUpdateService Error]', error);

    const backendError = error?.error || {};

    return throwError(() => ({
      message: backendError.message || 'Request failed',
      errors: backendError.errors || null,
    }));
  }
}
