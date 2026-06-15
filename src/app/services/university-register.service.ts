import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { UniversityRegisterRequest } from '../interfaces/university-register-request';
import { UniversityRegisterResponse } from '../interfaces/university-register-response';

@Injectable({
  providedIn: 'root',
})
//Servicio para crear una universidad
export class UniversityRegisterService {
  private readonly endpoint = `${API_URL}/auth/register-university`;

  constructor(private http: HttpClient) {}

  register(data: UniversityRegisterRequest): Observable<UniversityRegisterResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<UniversityRegisterResponse>(this.endpoint, data, { headers })
      .pipe(
        tap((response) => {
          if (response?.token) {
            sessionStorage.setItem('token', response.token);
          }

          if (response?.university) {
            sessionStorage.setItem('university', JSON.stringify(response.university));
          }
        }),
        catchError((error) => {
          console.error('[UniversityRegisterService] Register error:', error);

          const backendError = error?.error || {};
          const message = backendError.message || 'University register failed';
          const errors = backendError.errors || null;

          return throwError(() => ({
            message,
            errors,
          }));
        })
      );
  }
}