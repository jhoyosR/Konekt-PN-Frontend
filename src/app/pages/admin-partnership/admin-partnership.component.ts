import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { PartnershipService } from '../../services/partnership.service';
import { PartnershipResponse } from '../../interfaces/partnership-response';

@Component({
  selector: 'app-admin-partnerships',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-partnership.component.html',
  styleUrl: './admin-partnership.component.css',
})
export class AdminPartnershipComponent implements OnInit {
  partnerships: PartnershipResponse[] = [];
  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(private partnershipService: PartnershipService) {}

  ngOnInit(): void {
    this.loadPartnerships();
  }

  loadPartnerships(): void {
    this.partnershipService.getPartnerships(this.page).subscribe({
      next: (response: any) => {
        this.partnerships = response.data;

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
          text: 'No se pudieron cargar las alianzas',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  nextPage(): void {
    if (!this.hasNext) return;
    this.page++;
    this.loadPartnerships();
  }

  previousPage(): void {
    if (!this.hasPrev) return;
    this.page--;
    this.loadPartnerships();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.page = page;
    this.loadPartnerships();
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo':
        return 'active';
      case 'Suspendido':
        return 'pending';
      case 'Cerrado':
        return 'rejected';
      default:
        return '';
    }
  }
}
