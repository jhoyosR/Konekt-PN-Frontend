import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { API_URL } from '../../global';
import { UniversityListResponse } from '../interfaces/university-list-response';

@Injectable({
  providedIn: 'root',
})
//Servicio para las universidades
export class UniversityService {
  private readonly endpoint = `${API_URL}/university`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  //Obtener las universidades
  getUniversities(
    page?: number,
    all?: boolean,
  ): Observable<UniversityListResponse> {
    let params = new HttpParams();

    if (all) {
      params = params.set('all', 'true');
    } else if (page !== undefined) {
      params = params.set('page', page);
    }

    return this.http.get<UniversityListResponse>(this.endpoint, {
      params,
      headers: this.getAuthHeaders(),
    });
  }
  //Actualizar una universidad
  updateUniversity(
    id: number,
    data: {
      address?: string;
      phone?: string;
      password?: string;
      profilePhoto?: string;
    },
  ) {
    return this.http.patch(`${this.endpoint}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }
  //Obtener una universidad por id
  getUniversityById(id: number): Observable<any> {
    return this.http
      .get(`${this.endpoint}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[UniversityService] getUniversityById error:', error);

          return throwError(() => ({
            message: error?.error?.message || 'Error getting university',
            error,
          }));
        }),
      );
  }
}
