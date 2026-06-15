import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { VacanciesService } from '../../services/vacancies.service';
import { VacancieResponse } from '../../interfaces/vacancie-response';

@Component({
  selector: 'app-admin-vacancies',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-vacancies.component.html',
  styleUrl: './admin-vacancies.component.css',
})
export class AdminVacanciesComponent implements OnInit {
  vacancies: VacancieResponse[] = [];

  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(private vacanciesService: VacanciesService) {}

  ngOnInit(): void {
    this.loadVacancies();
  }
  //Metodo para cargar las vacantes
  loadVacancies(): void {
    this.vacanciesService.getVacancies(this.page).subscribe({
      next: (response: any) => {
        this.vacancies = response.data;

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
          text: 'No se pudieron cargar las vacantes',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }
  //Metodos para paginación
  nextPage(): void {
    if (!this.hasNext) return;
    this.page++;
    this.loadVacancies();
  }

  previousPage(): void {
    if (!this.hasPrev) return;
    this.page--;
    this.loadVacancies();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.page = page;
    this.loadVacancies();
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  //Metodos para poner colores en los estados en la tabla
  getStatusClass(status: string): string {
    switch (status) {
      case 'Activa':
        return 'active';

      case 'Suspendida':
        return 'suspended';

      case 'Cerrada':
        return 'closed';

      default:
        return '';
    }
  }
}
