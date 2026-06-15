import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { IntershipService } from '../../services/intership.service';
import { InternshipUpdateService } from '../../services/internship-update.service';

import { IntershipResponse } from '../../interfaces/internship-response';
import { InternshipUpdateResponse } from '../../interfaces/internship-update-response';

@Component({
  selector: 'app-university-intership',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './university-intership.component.html',
  styleUrl: './university-intership.component.css',
})
export class UniversityIntershipComponent implements OnInit {
  interships: (IntershipResponse & {
    updates?: InternshipUpdateResponse[];
  })[] = [];

  studentId!: number;
  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(
    private route: ActivatedRoute,
    private intershipService: IntershipService,
    private internshipUpdateService: InternshipUpdateService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('studentId');

      if (!id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se recibió studentId',
          confirmButtonColor: '#2563eb',
        });
        return;
      }

      this.studentId = Number(id);
      this.loadInterships();
    });
  }
  //Metodo para cargar la práctica de un estudiante en especifico
  loadInterships(): void {
    this.intershipService
      .getInterships({ studentId: this.studentId })
      .subscribe({
        next: (response) => {
          this.interships = (response.data || []).map((i) => ({
            ...i,
            updates: [],
          }));

          this.loadUpdates();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar la práctica',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }
  //Metodo para cargar las actualizaciones de una practica
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
  //Metodo para abrir los documentos cargados de un practicante en otra ventana
  openFile(url: string): void {
    if (!url) {
      return;
    }

    window.open(url, '_blank');
  }
}
