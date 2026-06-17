import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../interfaces/user-response';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  users: UserResponse[] = [];

  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  //Metodos para cargar los usuarios
  loadUsers(): void {
    this.userService.getUsers(this.page).subscribe({
      next: (response: any) => {
        this.users = response.data;
        console.log('Users response:', response);

        this.total = response.total;
        this.page = response.page;
        this.pageCount = response.page_count;
        this.hasNext = response.has_next;
        this.hasPrev = response.has_prev;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }
  //Metodos para paginación
  nextPage(): void {
    if (!this.hasNext) return;
    this.page++;
    this.loadUsers();
  }

  previousPage(): void {
    if (!this.hasPrev) return;
    this.page--;
    this.loadUsers();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.page = page;
    this.loadUsers();
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  //Metodo para formartear fecha
  formatDate(date: string | Date): string {
    if (!date) return '';

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      return String(date);
    }

    return parsed.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
