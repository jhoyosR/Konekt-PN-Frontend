import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';

import { CompanyRegisterRequest } from '../interfaces/company-register-request';
import { CompanyRegisterResponse } from '../interfaces/company-register-response';

@Injectable({
  providedIn: 'root',
})
//Servicio para registrar empresa
export class CompanyRegisterService {
  private readonly endpoint = `${API_URL}/auth/register-company`;

  constructor(private http: HttpClient) {}

  register(data: CompanyRegisterRequest): Observable<CompanyRegisterResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<CompanyRegisterResponse>(this.endpoint, data, { headers }).pipe(
      tap((response) => {
        if (response?.token) {
          sessionStorage.setItem('token', response.token);
        }

        if (response?.user) {
          sessionStorage.setItem('user', JSON.stringify(response.user));
        }
      }),
      catchError((error) => {
        console.error('[CompanyRegisterService] error:', error);

        const backendError = error?.error || {};
        const message = backendError.message || 'Company register failed';
        const errors = backendError.errors || null;

        return throwError(() => ({
          message,
          errors,
        }));
      })
    );
  }
}