import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { API_URL } from '../../global';
import { Company } from '../interfaces/company'; // ajusta ruta si cambia

export interface UpdateCompanyRequest {
  password?: string;
  description?: string;
  industry?: string;
  address?: string;
  phone?: string;
  profilePhoto?: string
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly endpoint = `${API_URL}/company`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  updateCompany(id: number, data: UpdateCompanyRequest): Observable<any> {
    return this.http
      .patch(`${this.endpoint}/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[CompanyService] updateCompany error:', error);

          return throwError(() => ({
            message: error?.error?.message || 'Error updating company',
            error,
          }));
        }),
      );
  }
getCompanies(page?: number, all = false): Observable<any> {
  const params: any = {};

  if (page) params.page = page;

  if (all) params.all = true;

  return this.http.get<any>(this.endpoint, {
    headers: this.getHeaders(),
    params,
  });
}
getCompanyById(id: number): Observable<any> {
  return this.http
    .get(`${this.endpoint}/${id}`, {
      headers: this.getHeaders(),
    })
    .pipe(
      catchError((error) => {
        console.error('[CompanyService] getCompanyById error:', error);

        return throwError(() => ({
          message: error?.error?.message || 'Error getting company',
          error,
        }));
      }),
    );
}
}
