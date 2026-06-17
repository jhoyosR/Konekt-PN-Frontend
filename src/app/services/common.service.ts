import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../global';

@Injectable({
  providedIn: 'root',
})
//Servicio para las constantes
export class CommonService {
  private readonly endpoint = `${API_URL}/common`;

  constructor(private http: HttpClient) {}

  getConstants(constantName: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.endpoint}/${constantName}`,
    );
  }
}