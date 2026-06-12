import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { VacanciesService } from '../../services/vacancies.service';
import { VacancieResponse } from '../../interfaces/vacancie-response';
import { ApplicationsService } from '../../services/applications.service';

import localeEsCo from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEsCo, 'es-CO');

@Component({
  selector: 'app-student-vacancies',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './student-vacancies.component.html',
  styleUrl: './student-vacancies.component.css',
})
export class StudentVacanciesComponent implements OnInit {
  vacancies: VacancieResponse[] = [];
page = 1;
total = 0;
pageCount = 0;
hasNext = false;
hasPrev = false;
  constructor(
    private vacanciesService: VacanciesService,
    private applicationsService: ApplicationsService,
  ) {}

  ngOnInit(): void {
    this.loadVacancies();
  }

loadVacancies(): void {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const notAppliedByStudentId = user?.profile?.id;

  this.vacanciesService
    .getVacancies(
      this.page,
      notAppliedByStudentId,
      'Activa'
    )
    .subscribe({
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
          customClass: { popup: 'konekt-swal' },
        });
      },
    });
}
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
  return Array.from(
    { length: this.pageCount },
    (_, i) => i + 1
  );
}

applyVacancy(vacancy: VacancieResponse): void {
  Swal.fire({
    title: '¿Postularte a esta vacante?',
    text: vacancy.title,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, postularme',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#ef4444',
    customClass: { popup: 'konekt-swal' },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Enviando postulación...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: 'konekt-swal' },
      });

      this.applicationsService.createApplication(vacancy.id!).subscribe({
        next: () => {
          this.loadVacancies();

          Swal.fire({
            icon: 'success',
            title: 'Postulación enviada',
            text: 'Te has postulado correctamente a la vacante.',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });
        },

        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo postular',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });
        },
      });
    }
  });
}
}
