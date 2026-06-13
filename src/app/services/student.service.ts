import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_URL } from '../../global';

import { StudentRegisterResponse } from '../interfaces/student-register-response';
import { StudentListResponse } from '../interfaces/student-list-response';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly endpoint = `${API_URL}/student`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getStudents(
    page: number,
    universityId?: number,
  ): Observable<StudentListResponse> {
    let params = new HttpParams().set('page', page);

    if (universityId !== undefined) {
      params = params.set('universityId', universityId);
    }

    return this.http
      .get<StudentListResponse>(this.endpoint, {
        headers: this.getHeaders(),
        params,
      })
      .pipe(
        catchError((error) => {
          console.error(
            '[StudentService] getStudents error:',
            error,
          );

          return throwError(() => ({
            message: 'Error fetching students',
            error,
          }));
        }),
      );
  }

  getStudentById(
    id: number,
  ): Observable<StudentRegisterResponse> {
    return this.http
      .get<StudentRegisterResponse>(
        `${this.endpoint}/${id}`,
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        catchError((error) => {
          console.error(
            '[StudentService] getStudentById error:',
            error,
          );

          return throwError(() => ({
            message: 'Error fetching student',
            error,
          }));
        }),
      );
  }
  updateStudent(
  id: number,
  data: {
    password?: string;
    about?: string;
    phone?: string;
    career?: string;
    semester?: number;
  }
): Observable<StudentRegisterResponse> {

  const payload = Object.fromEntries(
    Object.entries(data).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )
  );

  return this.http
    .patch<StudentRegisterResponse>(
      `${this.endpoint}/${id}`,
      payload,
      {
        headers: this.getHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        console.error(
          '[StudentService] updateStudent error:',
          error
        );

        return throwError(() => ({
          message: 'Error updating student',
          error,
        }));
      })
    );
}
}