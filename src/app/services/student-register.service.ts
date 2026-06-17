import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { API_URL } from '../../global';

import { StudentRegisterRequest } from '../interfaces/student-register-request';
import { StudentRegisterResponse } from '../interfaces/student-register-response';

@Injectable({
  providedIn: 'root',
})
//Servicio para crear un estudiante
export class StudentRegisterService {
  private readonly endpoint = `${API_URL}/auth/register-student`;

  constructor(private http: HttpClient) {}

  register(
    data: StudentRegisterRequest,
  ): Observable<StudentRegisterResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<StudentRegisterResponse>(
        this.endpoint,
        data,
        { headers },
      )
      .pipe(
        tap((response) => {
          if (response?.token) {
            sessionStorage.setItem(
              'token',
              response.token,
            );
          }

          if (response?.user) {
            sessionStorage.setItem(
              'user',
              JSON.stringify(response.user),
            );
          }

          if (response?.student) {
            sessionStorage.setItem(
              'student',
              JSON.stringify(response.student),
            );
          }
        }),
        catchError((error) => {
          console.error(
            '[StudentRegisterService] error:',
            error,
          );

          const backendError = error?.error || {};

          const message =
            backendError.message ||
            'Student register failed';

          const errors =
            backendError.errors || null;

          return throwError(() => ({
            message,
            errors,
          }));
        }),
      );
  }
}