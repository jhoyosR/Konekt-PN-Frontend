import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { ApplicationsService } from '../../services/applications.service';
import { ApplicationResponse } from '../../interfaces/application-response';

@Component({
  selector: 'app-student-applications',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './student-application.component.html',
  styleUrl: './student-application.component.css',
})
export class StudentApplicationComponent implements OnInit {
  applications: ApplicationResponse[] = [];
  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(private applicationsService: ApplicationsService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

 loadApplications(): void {
  const user = JSON.parse(
    sessionStorage.getItem('user') || '{}'
  );

  const studentId = user?.profile?.id;

  this.applicationsService
    .getApplications(this.page, undefined, studentId)
    .subscribe({
      next: (response) => {
        this.applications = response.data;

        console.log(
          'Applications response:',
          response
        );

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
          text: 'No se pudieron cargar las postulaciones',
          confirmButtonColor: '#2563eb',
          customClass: { popup: 'konekt-swal' },
        });
      },
    });
}
  nextPage(): void {
    if (!this.hasNext) return;

    this.page++;
    this.loadApplications();
  }

  previousPage(): void {
    if (!this.hasPrev) return;

    this.page--;
    this.loadApplications();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;

    this.page = page;
    this.loadApplications();
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }

  deleteApplication(id: number): void {
    Swal.fire({
      title: '¿Eliminar postulación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#2563eb',
      customClass: { popup: 'konekt-swal' },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminando...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          customClass: { popup: 'konekt-swal' },
        });

        this.applicationsService.deleteApplication(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminada',
              confirmButtonColor: '#2563eb',
              customClass: { popup: 'konekt-swal' },
            });

            this.loadApplications();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar',
              confirmButtonColor: '#2563eb',
              customClass: { popup: 'konekt-swal' },
            });
          },
        });
      }
    });
  }
}
