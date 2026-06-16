import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_URL } from '../../global';

@Injectable({
  providedIn: 'root',
})
//Servicio para las habilidades
export class SkillService {
  private readonly endpoint = `${API_URL}/skill`;
  private readonly studentEndpoint = `${API_URL}/student`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  //Obtener las habilidades
  getSkills(): Observable<any> {
    const params = new HttpParams().set('all', 'true');

    return this.http
      .get(this.endpoint, {
        headers: this.getHeaders(),
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('[SkillService] getSkills error:', error);

          return throwError(() => ({
            message: 'Error fetching skills',
            error,
          }));
        }),
      );
  }
  //Obtener una habilidad por id
  getSkillById(id: number): Observable<any> {
    return this.http
      .get(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[SkillService] getSkillById error:', error);

          return throwError(() => ({
            message: 'Error fetching skill',
            error,
          }));
        }),
      );
  }

  //Crear una habilidad para un estudiante
  createSkillStudent(studentId: number, skillId: number): Observable<any> {
    return this.http
      .post(
        `${this.studentEndpoint}/${studentId}/skills`,
        {
          skillId,
        },
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        catchError((error) => {
          console.error('[SkillService] createSkillStudent error:', error);

          return throwError(() => ({
            message: 'Error creating student skill',
            error,
          }));
        }),
      );
  }

  //Eliminar una habilidad para un estudiante
  deleteSkillStudent(studentId: number, skillId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.studentEndpoint}/${studentId}/skills/${skillId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[SkillService] deleteSkillStudent error:', error);

          return throwError(() => ({
            message: 'Error deleting student skill',
            error,
          }));
        }),
      );
  }
  // Crear una habilidad para una vacante
  createSkillVacancie(vacancieId: number, skillId: number): Observable<any> {
    return this.http
      .post(
        `${API_URL}/vacancie/${vacancieId}/skills`,
        {
          skillId,
        },
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        catchError((error) => {
          console.error('[SkillService] createSkillVacancie error:', error);

          return throwError(() => ({
            message: 'Error creating vacancie skill',
            error,
          }));
        }),
      );
  }
  //Eliminar una habilidad para una vacante
  deleteSkillVacancie(vacancieId: number, skillId:number): Observable<void> {
  return this.http
    .delete<void>(`${API_URL}/vacancie/${vacancieId}/skills/${skillId}`, {
      headers: this.getHeaders(),
    })
    .pipe(
      catchError((error) => {
        console.error('[SkillService] deleteSkillVacancie error:', error);

        return throwError(() => ({
          message: 'Error deleting vacancie skill',
          error,
        }));
      }),
    );
}
  //Eliminar habilidad
  deleteSkill(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpoint}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[SkillService] deleteSkill error:', error);

          return throwError(() => ({
            message: 'Error deleting skill',
            error,
          }));
        }),
      );
  }
}
