import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../global';

@Injectable({
  providedIn: 'root',
})
// Servicio para las notificaciones
export class NotificationService {
  private readonly endpoint = `${API_URL}/notification`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener notificaciones
  getNotifications(): Observable<any> {
    return this.http
      .get<any>(this.endpoint, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[NotificationService] getNotifications error:', error);

          return throwError(() => ({
            message: 'Error fetching notifications',
            error,
          }));
        }),
      );
  }

  // Marcar una notificación como leída
  markAsRead(id: number): Observable<any> {
    return this.http
      .patch<any>(
        `${this.endpoint}/${id}/read`,
        {},
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        catchError((error) => {
          console.error('[NotificationService] markAsRead error:', error);

          return throwError(() => ({
            message: 'Error marking notification as read',
            error,
          }));
        }),
      );
  }

  // Obtener cantidad de no leídas
  getUnreadCount(): Observable<any> {
    return this.http
      .get<any>(`${this.endpoint}/unread/count`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('[NotificationService] getUnreadCount error:', error);

          return throwError(() => ({
            message: 'Error fetching unread count',
            error,
          }));
        }),
      );
  }

  // Marcar todas las no leídas como leídas
  markAllAsRead(): Observable<any> {
    return this.http
      .patch<any>(
        `${this.endpoint}/read-all`,
        {},
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        catchError((error) => {
          console.error('[NotificationService] markAllAsRead error:', error);

          return throwError(() => ({
            message: 'Error marking all notifications as read',
            error,
          }));
        }),
      );
  }
}
