import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../global';

import { ApplicationRequest } from '../interfaces/application-request';
import { ApplicationResponse } from '../interfaces/application-response';
import { ApplicationListResponse } from '../interfaces/application-list-response';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private readonly endpoint = `${API_URL}/application`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  createApplication(vacancieId: number): Observable<ApplicationResponse> {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const studentId = user?.profile?.id;

    const body: ApplicationRequest = {
      status: 'Activa',
      studentId,
    };

    return this.http
      .post<ApplicationResponse>(`${this.endpoint}/${vacancieId}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[ApplicationsService] apply error:', error);
          return throwError(() => error);
        }),
      );
  }

getApplications(
  page: number = 1,
  companyId?: number,
  studentId?: number
): Observable<ApplicationListResponse> {

  let params = new HttpParams()
    .set('page', page);

  if (companyId !== undefined) {
    params = params.set('companyId', companyId);
  }

  if (studentId !== undefined) {
    params = params.set('studentId', studentId);
  }

  return this.http
    .get<ApplicationListResponse>(this.endpoint, {
      headers: this.getHeaders(),
      params,
    })
    .pipe(
      catchError((error) => {
        console.error(
          '[ApplicationsService] getApplications error:',
          error,
        );

        return throwError(() => ({
          message: 'Error fetching applications',
          error,
        }));
      }),
    );
}

  getApplicationById(id: number): Observable<ApplicationResponse> {
    return this.http
      .get<ApplicationResponse>(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[ApplicationsService] getById error:', error);
          return throwError(() => error);
        }),
      );
  }

  updateApplication(
    id: number,
    data: Partial<ApplicationRequest>,
  ): Observable<ApplicationResponse> {
    return this.http
      .patch<ApplicationResponse>(`${this.endpoint}/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[ApplicationsService] update error:', error);
          return throwError(() => error);
        }),
      );
  }

  deleteApplication(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[ApplicationsService] delete error:', error);
          return throwError(() => error);
        }),
      );
  }
}
