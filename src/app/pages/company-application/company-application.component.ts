import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { ApplicationsService } from '../../services/applications.service';
import { CommonService } from '../../services/common.service';
import { ApplicationResponse } from '../../interfaces/application-response';
import { ApplicationRequest } from '../../interfaces/application-request';
import { IntershipService } from '../../services//intership.service';

@Component({
  selector: 'app-company-applications',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './company-application.component.html',
  styleUrl: './company-application.component.css',
})
export class CompanyApplicationComponent implements OnInit {
  applications: ApplicationResponse[] = [];
  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;
  statuses: any[] = [];


  constructor(
    private applicationsService: ApplicationsService,
    private commonService: CommonService,
    private intershipService: IntershipService,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
    this.loadCatalogs();
   
  }

  loadCatalogs(): void {
    this.commonService.getConstants('application-status').subscribe({
      next: (res) => (this.statuses = res),
      error: (err) => console.error('Error statuses', err),
    });
  }

loadApplications(): void {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const companyId = user?.profile?.id;

  this.applicationsService
    .getApplications(
      this.page,
      companyId,
      undefined,
      true,
    )
    .subscribe({
      next: (response) => {
        this.applications = response.data;

        console.log('Applications response:', response);

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

  updateApplication(app: ApplicationResponse): void {
    Swal.fire({
      title: `<span style="font-family:Segoe UI; font-weight:600;">Actualizar postulación</span>`,
      width: '650px',
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

        .swal-field {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 14px;
          text-align: center;
          transition: 0.2s ease;
        }

        .swal-field:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
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

        select.swal-field {
          appearance: none;
          background-color: white;
          text-align: center;
          text-align-last: center;
        }

        textarea.swal-field {
          text-align: center;
          resize: none;
          min-height: 90px;
        }
      </style>

      <div class="swal-form">

        <div class="swal-group">
          <label>Estado de la postulación</label>

          <select id="status" class="swal-field">
            <option value="" disabled>
              Seleccione estado
            </option>

            ${this.statuses
              .map(
                (s) => `
                  <option
                    value="${s}"
                    ${app.status === s ? 'selected' : ''}
                  >
                    ${s}
                  </option>
                `,
              )
              .join('')}
          </select>
        </div>

        <div class="swal-group">
          <label>Comentarios de la empresa</label>

          <textarea
            id="companyComments"
            class="swal-field"
            placeholder="Opcional"
          >${app.companyComments ?? ''}</textarea>
        </div>

      </div>
    `,

      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',

      preConfirm: () => {
        const status = (document.getElementById('status') as HTMLSelectElement)
          .value;

        const companyComments = (
          document.getElementById('companyComments') as HTMLTextAreaElement
        ).value.trim();

        if (!status) {
          Swal.showValidationMessage('El estado es obligatorio');
          return false;
        }

        const payload: Partial<ApplicationRequest> = {
          status,
        };

        if (companyComments) {
          payload.companyComments = companyComments;
        }

        return payload;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          title: 'Actualizando...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          customClass: {
            popup: 'konekt-swal',
          },
        });

        this.applicationsService
          .updateApplication(app.id!, result.value)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'La postulación fue actualizada correctamente',
                confirmButtonColor: '#2563eb',
                customClass: {
                  popup: 'konekt-swal',
                },
              });

              this.loadApplications();
            },

            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la postulación',
                confirmButtonColor: '#2563eb',
                customClass: {
                  popup: 'konekt-swal',
                },
              });
            },
          });
      }
    });
  }
  managePractice(applicationId: number): void {
  Swal.fire({
    title: `<span style="font-family:Segoe UI; font-weight:600;">Contratar practicante</span>`,
    width: '750px',
    showCloseButton: true,
    customClass: {
      popup: 'konekt-swal',
    },

    html: `
    <style>
      .swal-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
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

      .swal-field {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 14px;
        text-align: center;
      }

      .swal-field:focus {
        outline: none;
        border-color: #2563eb;
      }
    </style>

    <div class="swal-form">

      <!-- START DATE -->
      <div class="swal-group">
        <label>Fecha inicio *</label>
        <input id="startDate" type="date" class="swal-field" />
      </div>

      <!-- END DATE -->
      <div class="swal-group">
        <label>Fecha fin *</label>
        <input id="endDate" type="date" class="swal-field" />
      </div>

    </div>
  `,

    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#ef4444',

    preConfirm: () => {
      const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
      const endDate = (document.getElementById('endDate') as HTMLInputElement).value;

      if (!startDate || !endDate) {
        Swal.showValidationMessage('Todos los campos son obligatorios');
        return false;
      }

      return {
        status: 'Activa', // 👈 fijo por backend
        startDate,
        endDate,
        applicationId,
      };
    },
  }).then((result) => {
    if (!result.isConfirmed || !result.value) return;

    Swal.fire({
      title: 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      customClass: { popup: 'konekt-swal' },
    });

    this.intershipService.createIntership(result.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Contrada/o',
          confirmButtonColor: '#2563eb',
          customClass: { popup: 'konekt-swal' },
        });

        // ❌ no reload si no quieres
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo gestionar la práctica',
          confirmButtonColor: '#2563eb',
          customClass: { popup: 'konekt-swal' },
        });
      },
    });
  });
}
}
