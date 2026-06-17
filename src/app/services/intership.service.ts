import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../global';

import { IntershipRequest } from '../interfaces/internship-request';
import { InternshipListResponse } from '../interfaces/internship-list-response';
import { IntershipResponse } from '../interfaces/internship-response';
@Injectable({
  providedIn: 'root',
})
//Servicio para las prácticas
export class IntershipService {
  private readonly endpoint = `${API_URL}/internship`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  //Obtener las prácticas
  getInterships(params?: {
    page?: number;
    all?: boolean;
    studentId?: number;
    companyId?: number;
  }): Observable<InternshipListResponse> {
    let httpParams = new HttpParams();

    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page);
    }

    if (params?.all !== undefined) {
      httpParams = httpParams.set('all', params.all);
    }

    if (params?.studentId !== undefined) {
      httpParams = httpParams.set('studentId', params.studentId);
    }

    if (params?.companyId !== undefined) {
      httpParams = httpParams.set('companyId', params.companyId);
    }

    return this.http
      .get<InternshipListResponse>(this.endpoint, {
        headers: this.getHeaders(),
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //Crear una práctica
  createIntership(data: IntershipRequest): Observable<IntershipResponse> {
    return this.http
      .post<IntershipResponse>(this.endpoint, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  //Actualizar una práctica
  updateIntership(
    id: number,
    data: Partial<IntershipRequest>,
  ): Observable<IntershipResponse> {
    return this.http
      .patch<IntershipResponse>(`${this.endpoint}/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  //Eliminar una práctica
  deleteIntership(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  //Obtener una práctica por id
  getIntershipById(id: number): Observable<IntershipResponse> {
    return this.http
      .get<IntershipResponse>(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  private handleError(error: any) {
    console.error('[IntershipService Error]', error);

    const backendError = error?.error || {};
    const message = backendError.message || 'Request failed';
    const errors = backendError.errors || null;

    return throwError(() => ({
      message,
      errors,
    }));
  }
}
