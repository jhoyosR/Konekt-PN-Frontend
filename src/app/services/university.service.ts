import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../global';
import { UniversityListResponse } from '../interfaces/university-list-response';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private readonly endpoint = `${API_URL}/university`;

  constructor(private http: HttpClient) {}
getUniversities(page?: number, all?: boolean): Observable<UniversityListResponse> {
  let params = new HttpParams();

  if (all) {
    params = params.set('all', 'true');
  } else if (page !== undefined) {
    params = params.set('page', page);
  }

  return this.http.get<UniversityListResponse>(this.endpoint, { params });
}
}
