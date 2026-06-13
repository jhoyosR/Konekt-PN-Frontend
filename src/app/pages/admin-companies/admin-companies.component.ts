import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../interfaces/company';

@Component({
  selector: 'app-admin-companies',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-companies.component.html',
  styleUrl: './admin-companies.component.css',
})
export class AdminCompaniesComponent implements OnInit {
  companies: Company[] = [];

  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompanies(this.page).subscribe({
      next: (response: any) => {
        this.companies = response.data;

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
          text: 'No se pudieron cargar las empresas',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  nextPage(): void {
    if (!this.hasNext) return;
    this.page++;
    this.loadCompanies();
  }

  previousPage(): void {
    if (!this.hasPrev) return;
    this.page--;
    this.loadCompanies();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.page = page;
    this.loadCompanies();
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
}
