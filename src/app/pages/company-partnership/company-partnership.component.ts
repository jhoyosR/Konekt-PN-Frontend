import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { PartnershipService } from '../../services/partnership.service';
import { CommonService } from '../../services/common.service';

import { PartnershipResponse } from '../../interfaces/partnership-response';
import { PartnershipRequest } from '../../interfaces/partnership-request';
import { NavbarComponent } from '../navbar/navbar.component';
import { UniversityService } from '../../services/university.service';
import { University } from '../../interfaces/university';

@Component({
  selector: 'app-company-partnership',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './company-partnership.component.html',
  styleUrl: './company-partnership.component.css',
})
export class CompanyPartnershipComponent implements OnInit {
  partnerships: PartnershipResponse[] = [];

  statuses: any[] = [];

  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;
  universities: University[] = [];
  displayUniversities: University[] = [];
  constructor(
    private partnershipService: PartnershipService,
    private commonService: CommonService,
    private universityService: UniversityService,
  ) {}

  ngOnInit(): void {
    this.loadPartnerships();
    this.loadCatalogs();
    this.loadUniversities();
  }

  loadCatalogs(): void {
    this.commonService.getConstants('partnership-status').subscribe({
      next: (res) => (this.statuses = res),
      error: (err) => console.error('Error loading statuses', err),
    });
  }
  loadUniversities(): void {
    this.universityService.getUniversities(undefined, true).subscribe({
      next: (res: any) => {
        this.universities = res ?? [];
        this.displayUniversities = [...this.universities];
      },
      error: (err) => {
        console.error('Error cargando universidades', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las universidades',
          confirmButtonColor: '#2563eb',
          customClass: { popup: 'konekt-swal' },
        });
      },
    });
  }

  loadPartnerships(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const companyId = user?.profile?.id;

    this.partnershipService
      .getPartnerships(this.page, undefined, companyId)
      .subscribe({
        next: (response) => {
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
            text: 'No se pudieron cargar los convenios',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
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

  openCreatePartnershipModal(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const companyId = user?.profile?.id;

    Swal.fire({
      title: `<span style="font-family:Segoe UI; font-weight:600;">Crear convenio</span>`,
      width: '750px',

      position: 'top',

      showCloseButton: true,

      customClass: {
        popup: 'konekt-swal',
      },

      didOpen: () => {
        const container = document.querySelector(
          '.swal2-container',
        ) as HTMLElement;
        if (container) {
          container.style.alignItems = 'flex-start';
          container.style.paddingTop = '120px';
        }

        const popup = document.querySelector('.swal2-popup') as HTMLElement;
        if (popup) {
          popup.style.overflow = 'visible';
        }
      },

      html: `
      <style>
        .swal-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          font-family: Segoe UI, sans-serif;
          font-size: 14px;
        }

        .swal-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-weight: 600;
          color: #0f172a;
          text-align: center;
        }

        .swal-field {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px;
          font-size: 14px;
          text-align: center;
          background: white;
        }

        .swal-field:focus {
          outline: none;
          border-color: #2563eb;
        }

        textarea.swal-field {
          resize: none;
          min-height: 80px;
        }

       
        .swal2-popup {
          overflow: visible !important;
        }

        .swal2-container {
          overflow-y: auto !important;
        }
      </style>

      <div class="swal-form">

        <div class="swal-group" style="grid-column: span 2;">
          <label>Comentario *</label>
          <textarea id="comment" class="swal-field" placeholder="Escribe un comentario"></textarea>
        </div>

        <div class="swal-group" style="grid-column: span 2;">
          <label>Universidad *</label>

          <select id="universityId" class="swal-field">
            <option value="" disabled selected>Seleccione una universidad</option>
            ${this.displayUniversities
              .map((u) => `<option value="${u.id}">${u.name}</option>`)
              .join('')}
          </select>

        </div>

      </div>
    `,

      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',

      preConfirm: () => {
        const popup = Swal.getPopup()!;

        const comment = (
          popup.querySelector('#comment') as HTMLTextAreaElement
        ).value.trim();

        const universityId = Number(
          (popup.querySelector('#universityId') as HTMLSelectElement).value,
        );

        if (!comment) {
          Swal.showValidationMessage('El comentario es obligatorio');
          return false;
        }

        if (!universityId || !companyId) {
          Swal.showValidationMessage('Debes seleccionar una universidad');
          return false;
        }

        return {
          comment,
          universityId,
          companyId,
          status: 'Solicitado',
        };
      },
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return;

      Swal.fire({
        title: 'Creando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: 'konekt-swal' },
      });

      this.partnershipService.createPartnership(result.value).subscribe({
        next: () => {
          Swal.close();

          Swal.fire({
            icon: 'success',
            title: 'Convenio creado',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });

          this.loadPartnerships();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error creando convenio',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });
        },
      });
    });
  }

  openUpdatePartnershipModal(p: PartnershipResponse): void {
    Swal.fire({
      title: `<span style="font-family:Segoe UI; font-weight:600;">Actualizar convenio</span>`,
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
          font-family: "Segoe UI", sans-serif;
          font-size: 14px;
        }

        .swal-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-weight: 600;
          color: #0f172a;
          text-align: center;
        }

        .swal-field {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px;
          font-size: 14px;
          text-align: center;
        }

        .swal-field:focus {
          outline: none;
          border-color: #2563eb;
        }

        textarea.swal-field {
          resize: none;
          min-height: 90px;
        }

        select.swal-field {
          cursor: pointer;
        }
      </style>

      <div class="swal-form">

      
        <div class="swal-group" style="grid-column: span 2;">
          <label>Comentario *</label>
          <textarea id="comment" class="swal-field">${p.comment ?? ''}</textarea>
        </div>

       
        <div class="swal-group" style="grid-column: span 2;">
          <label>Estado *</label>
          <select id="status" class="swal-field">

            ${this.statuses
              .map(
                (s: any) => `
                  <option value="${s.name ?? s}" 
                    ${p.status === (s.name ?? s) ? 'selected' : ''}>
                    ${s.name ?? s}
                  </option>
                `,
              )
              .join('')}

          </select>
        </div>

      </div>
    `,

      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',

      preConfirm: () => {
        const popup = Swal.getPopup()!;

        const comment = (
          popup.querySelector('#comment') as HTMLTextAreaElement
        ).value.trim();

        const status = (popup.querySelector('#status') as HTMLSelectElement)
          .value;

        if (!comment || !status) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        return {
          comment,
          status,
        };
      },
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return;

      Swal.fire({
        title: 'Actualizando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: 'konekt-swal' },
      });

      this.partnershipService.updatePartnership(p.id, result.value).subscribe({
        next: () => {
          Swal.close();

          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });

          this.loadPartnerships();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error actualizando',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });
        },
      });
    });
  }

  deletePartnership(id: number): void {
    Swal.fire({
      title: '¿Eliminar convenio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#2563eb',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'konekt-swal' },
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.partnershipService.deletePartnership(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });

          this.loadPartnerships();
        },
      });
    });
  }
}
