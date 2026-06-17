import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { UniversityService } from '../../services/university.service';
import { University } from '../../interfaces/university';

@Component({
  selector: 'app-admin-universities',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-universities.component.html',
  styleUrl: './admin-universities.component.css',
})
export class AdminUniversitiesComponent implements OnInit {
  universities: University[] = [];

  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.loadUniversities();
  }
//Metodo para cargar las universidades
  loadUniversities(): void {
    this.universityService.getUniversities(this.page).subscribe({
      next: (response: any) => {
        this.universities = response.data;

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
          text: 'No se pudieron cargar las universidades',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }
//Metodos de paginacion
  nextPage(): void {
    if (!this.hasNext) return;
    this.page++;
    this.loadUniversities();
  }

  previousPage(): void {
    if (!this.hasPrev) return;
    this.page--;
    this.loadUniversities();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.page = page;
    this.loadUniversities();
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
}
