import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';

import { InternshipUpdateService } from '../../services/internship-update.service';

import { InternshipUpdateResponse } from '../../interfaces/internship-update-response';
import { InternshipUpdateListResponse } from '../../interfaces/internship-update-list-response';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-internship-update',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './company-intership-update.component.html',
  styleUrl: './company-intership-update.component.css',
})
export class CompanyIntershipUpdateComponent implements OnInit {
  updates: InternshipUpdateResponse[] = [];

  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  internshipId?: number;

  constructor(
    private internshipUpdateService: InternshipUpdateService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const internshipId = params.get('internshipId');

      if (internshipId) {
        this.internshipId = Number(internshipId);
      }

      this.loadUpdates();
    });
  }
  loadUpdates(): void {
    this.internshipUpdateService
      .getInternshipUpdates({
        page: this.page,
        internshipId: this.internshipId,
      })
      .subscribe({
        next: (response: InternshipUpdateListResponse) => {
          this.updates = response.data;

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
            text: 'No se pudieron cargar las actualizaciones',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'konekt-swal',
            },
          });
        },
      });
  }

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

  updateInternshipUpdate(update: InternshipUpdateResponse): void {
    Swal.fire({
      title: `<span style="font-family:Segoe UI; font-weight:600;">Actualizar seguimiento</span>`,
      width: '700px',
      showCloseButton: true,
      customClass: {
        popup: 'konekt-swal',
      },

      html: `
      <style>
        .swal-form {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          font-family: Inter, sans-serif;
          font-size: 14px;
        }

        .swal-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-weight: 600;
          color: #111827;
          text-align: center;
        }

        .required {
          color: #ef4444;
          margin-left: 3px;
        }

        .swal-field {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 10px;
          font-size: 14px;
          text-align: center;
        }

        .swal-field:focus {
          outline: none;
          border-color: #2563eb;
        }

        textarea.swal-field {
          min-height: 120px;
          resize: vertical;
        }
      </style>

      <div class="swal-form">

        <div class="swal-group">
          <label>
            Título
            <span class="required">*</span>
          </label>

          <input
            id="title"
            class="swal-field"
            value="${update.title}"
          />
        </div>

        <div class="swal-group">
          <label>
            Descripción
            <span class="required">*</span>
          </label>

          <textarea
            id="description"
            class="swal-field"
          >${update.description}</textarea>
        </div>

      </div>
    `,

      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',

      preConfirm: () => {
        const title = (
          document.getElementById('title') as HTMLInputElement
        ).value.trim();

        const description = (
          document.getElementById('description') as HTMLTextAreaElement
        ).value.trim();

        if (!title || !description) {
          Swal.showValidationMessage('Título y descripción son obligatorios');
          return false;
        }

        return {
          title,
          description,
        };
      },
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return;

      Swal.fire({
        title: 'Actualizando seguimiento...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: 'konekt-swal',
        },
      });

      this.internshipUpdateService
        .updateInternshipUpdate(update.id, result.value)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Seguimiento actualizado',
              confirmButtonColor: '#2563eb',
              customClass: {
                popup: 'konekt-swal',
              },
            });

            this.loadUpdates();
          },

          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el seguimiento',
              customClass: {
                popup: 'konekt-swal',
              },
            });
          },
        });
    });
  }
  deleteInternshipUpdate(id: number): void {
    Swal.fire({
      title: '¿Eliminar seguimiento?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#2563eb',
      customClass: {
        popup: 'konekt-swal',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      Swal.fire({
        title: 'Eliminando...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: 'konekt-swal',
        },
      });

      this.internshipUpdateService.deleteInternshipUpdate(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Seguimiento eliminado',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'konekt-swal',
            },
          });

          this.loadUpdates();
        },

        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el seguimiento',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'konekt-swal',
            },
          });
        },
      });
    });
  }
}
