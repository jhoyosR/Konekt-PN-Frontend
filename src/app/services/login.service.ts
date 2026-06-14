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
  private readonly authEndpoint = `${API_URL}/auth`;

  constructor(private http: HttpClient) {}

  login(
    credentials: LoginRequest,
  ): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<LoginResponse>(
        `${this.authEndpoint}/login`,
        credentials,
        { headers },
      )
      .pipe(
        tap((response) => {
          if (response?.token) {
            sessionStorage.setItem(
              'token',
              response.token,
            );

            sessionStorage.setItem(
              'user',
              JSON.stringify(response.user),
            );
          }
        }),
        catchError((error) => {
          console.error(
            '[LoginService] Login error:',
            error,
          );

          const backendError = error?.error || {};

          return throwError(() => ({
            message:
              backendError.message ||
              'Login failed',
            errors:
              backendError.errors || null,
          }));
        }),
      );
  }

  forgotPassword(
    email: string,
  ): Observable<any> {
    return this.http
      .post(
        `${this.authEndpoint}/forgot-password`,
        { email },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        },
      )
      .pipe(
        catchError((error) => {
          const backendError =
            error?.error || {};

          return throwError(() => ({
            message:
              backendError.message ||
              'Error sending reset email',
            errors:
              backendError.errors || null,
          }));
        }),
      );
  }

  resetPassword(
    token: string,
    password: string,
  ): Observable<any> {
    return this.http
      .post(
        `${this.authEndpoint}/reset-password`,
        {
          token,
          password,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        },
      )
      .pipe(
        catchError((error) => {
          const backendError =
            error?.error || {};

          return throwError(() => ({
            message:
              backendError.message ||
              'Error resetting password',
            errors:
              backendError.errors || null,
          }));
        }),
      );
  }
}