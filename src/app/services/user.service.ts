import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_URL } from '../../global';
import { UserResponse } from '../interfaces/user-response';
import { UserListResponse } from '../interfaces/user-list-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint = `${API_URL}/user`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUsers(
    page: number,
  ): Observable<UserListResponse> {
    const params = new HttpParams().set('page', page);

    return this.http
      .get<UserListResponse>(this.endpoint, {
        headers: this.getHeaders(),
        params,
      })
      .pipe(
        catchError((error) => {
          console.error(
            '[UserService] getUsers error:',
            error,
          );

          return throwError(() => ({
            message: 'Error fetching users',
            error,
          }));
        }),
      );
  }

  getUserById(
    id: number,
  ): Observable<UserResponse> {
    return this.http
      .get<UserResponse>(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(
            '[UserService] getUserById error:',
            error,
          );

          return throwError(() => ({
            message: 'Error fetching user',
            error,
          }));
        }),
      );
  }
}