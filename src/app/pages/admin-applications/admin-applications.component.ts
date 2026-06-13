import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { ApplicationsService } from '../../services/applications.service';
import { ApplicationResponse } from '../../interfaces/application-response';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-applications.component.html',
  styleUrl: './admin-applications.component.css',
})
export class AdminApplicationsComponent implements OnInit {
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
    this.applicationsService.getApplications(this.page).subscribe({
      next: (response: any) => {
        this.applications = response.data;

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
