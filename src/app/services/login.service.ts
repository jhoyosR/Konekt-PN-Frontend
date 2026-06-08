import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly endpoint = `${API_URL}/auth/login`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<LoginResponse>(this.endpoint, credentials, { headers })
      .pipe(
        tap((response) => {
          if (response?.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('user', JSON.stringify(response.user));
          }
        }),
        catchError((error) => {
          console.error('[LoginService] Login error:', error);

          const backendError = error?.error || {};
          const message = backendError.message || 'Login failed';
          const errors = backendError.errors || null;

          return throwError(() => ({
            message,
            errors,
          }));
        })
      );
  }
}