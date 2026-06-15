import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { IntershipService } from '../../services/intership.service';
import { IntershipResponse } from '../../interfaces/internship-response';
import { NavbarComponent } from '../navbar/navbar.component';
import { InternshipUpdateService } from '../../services/internship-update.service';
import { InternshipUpdateResponse } from '../../interfaces/internship-update-response';

type IntershipWithUpdates = IntershipResponse & {
  updates: InternshipUpdateResponse[]; // 👈 obligatorio (NO opcional)
};

@Component({
  selector: 'app-student-intership',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './student-internship.component.html',
  styleUrl: './student-internship.component.css',
})
export class StudentInternshipComponent implements OnInit {
  interships: IntershipWithUpdates[] = [];
  studentId!: number;
  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(
    private intershipService: IntershipService,
    private internshipUpdateService: InternshipUpdateService,
  ) {}

  ngOnInit(): void {
    this.loadInterships();
  }
//Metodo para cargar la práctica
  loadInterships(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.studentId = user?.profile?.id;

    if (!this.studentId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el estudiante',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.intershipService
      .getInterships({ studentId: this.studentId })
      .subscribe({
        next: (res) => {
          this.interships = (res.data || []).map((i) => ({
            ...i,
            updates: [], 
          }));

          this.loadUpdates();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las prácticas',
          });
        },
      });
  }
//Metodo para cargar los seguimientos de la práctica
  loadUpdates(): void {
    this.interships.forEach((intership) => {
      this.internshipUpdateService
        .getInternshipUpdates({
          page: this.page,
          internshipId: intership.id,
        })
        .subscribe({
          next: (response) => {
            intership.updates = response.data || [];

            this.total = response.total;
            this.pageCount = response.page_count;
            this.hasNext = response.has_next;
            this.hasPrev = response.has_prev;
          },
          error: () => {
            intership.updates = [];
          },
        });
    });
  }
//Metodos de paginación
  nextPage(): void {
    if (!this.hasNext) return;
    this.page++;
    this.loadUpdates();
  }

  previousPage(): void {
    if (!this.hasPrev) return;
    this.page--;
    this.loadUpdates();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.page = page;
    this.loadUpdates();
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
}