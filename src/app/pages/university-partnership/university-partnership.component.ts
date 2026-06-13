import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { PartnershipService } from '../../services/partnership.service';

import { NavbarComponent } from '../navbar/navbar.component';

import { PartnershipResponse } from '../../interfaces/partnership-response';
import { PartnershipRequest } from '../../interfaces/partnership-request';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../interfaces/company';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-university-partnership',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './university-partnership.component.html',
  styleUrl: './university-partnership.component.css',
})
export class UniversityPartnershipComponent implements OnInit {
  partnerships: PartnershipResponse[] = [];
  companies: any[] = [];
  displayCompanies: Company[] = [];

  statuses: any[] = [];
  page = 1;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(
    private partnershipService: PartnershipService,
    private companyService: CompanyService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadPartnerships();
    this.loadCompanies();
    this.loadCatalogs();
  }

  // ================= PAGINATION =================
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
  loadCatalogs(): void {
    this.commonService.getConstants('partnership-status').subscribe({
      next: (res) => (this.statuses = res),
      error: (err) => console.error('Error loading statuses', err),
    });
  }
  // ================= COMPANIES =================
  loadCompanies(): void {
    this.companyService.getCompanies(undefined, true).subscribe({
      next: (res: any) => {
        // 🔥 soporta ambos formatos: {data: []} o []
        this.companies = Array.isArray(res) ? res : (res?.data ?? []);

        this.displayCompanies = [...this.companies];

        console.log('companies:', this.displayCompanies);
      },
      error: (err) => {
        console.error('Error cargando empresas', err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las empresas',
          confirmButtonColor: '#2563eb',
          customClass: { popup: 'konekt-swal' },
        });
      },
    });
  }
  // ================= LIST =================
  loadPartnerships(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const universityId = user?.profile?.id;

    this.partnershipService
      .getPartnerships(this.page, universityId, undefined)
      .subscribe({
        next: (res) => {
          this.partnerships = res.data;
          this.page = res.page;
          this.pageCount = res.page_count;
          this.hasNext = res.has_next;
          this.hasPrev = res.has_prev;
        },
        error: () => {
          Swal.fire('Error', 'No se pudieron cargar los convenios', 'error');
        },
      });
  }

  // ================= CREATE =================
 openCreatePartnershipModal(): void {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const universityId = user?.profile?.id;

  Swal.fire({
    title: `<span style="font-family:Segoe UI;font-weight:600;">Crear convenio</span>`,
    width: '750px',
    position: 'top',

    showCloseButton: true,
    customClass: { popup: 'konekt-swal' },

    didOpen: () => {
      const container = document.querySelector('.swal2-container') as HTMLElement;
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
        .swal-form{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
          font-family:Segoe UI, sans-serif;
          font-size:14px;
        }

        .swal-group{
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        label{
          font-weight:600;
          color:#0f172a;
          text-align:center;
        }

        .swal-field{
          width:100%;
          box-sizing:border-box;
          border:1px solid #d1d5db;
          border-radius:8px;
          padding:10px;
          font-size:14px;
          text-align:center;
          background:white;
        }

        .swal-field:focus{
          outline:none;
          border-color:#2563eb;
        }

        textarea.swal-field{
          resize:none;
          min-height:80px;
        }

        .swal2-popup{
          overflow:visible !important;
        }

        .swal2-container{
          overflow-y:auto !important;
        }
      </style>

      <div class="swal-form">

        <!-- COMMENT -->
        <div class="swal-group" style="grid-column:span 2;">
          <label>Comentario</label>
          <textarea id="comment" class="swal-field" placeholder="Escribe un comentario"></textarea>
        </div>

        <!-- COMPANY -->
        <div class="swal-group" style="grid-column:span 2;">
          <label>Empresa *</label>

          <select id="companyId" class="swal-field">
            <option value="" disabled selected>Seleccione una empresa</option>
            ${this.companies
              .map((c: any) => `<option value="${c.id}">${c.name}</option>`)
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

      const commentValue = (
        popup.querySelector('#comment') as HTMLTextAreaElement
      ).value.trim();

      const companyId = Number(
        (popup.querySelector('#companyId') as HTMLSelectElement).value,
      );

      if (!companyId || !universityId) {
        Swal.showValidationMessage('Debes seleccionar una empresa');
        return false;
      }

      const payload: any = {
        companyId,
        universityId,
        status: 'Activo',
      };

      // SOLO enviar comment si existe
      if (commentValue) {
        payload.comment = commentValue;
      }

      return payload;
    },
  }).then((res) => {
    if (!res.isConfirmed || !res.value) return;

    Swal.fire({
      title: 'Creando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      customClass: { popup: 'konekt-swal' },
    });

    this.partnershipService.createPartnership(res.value).subscribe({
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
  // ================= UPDATE =================
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

        <!-- COMMENT (opcional visualmente) -->
        <div class="swal-group" style="grid-column: span 2;">
          <label>Comentario</label>
          <textarea id="comment" class="swal-field">${
            p.comment ?? ''
          }</textarea>
        </div>

        <!-- STATUS -->
        <div class="swal-group" style="grid-column: span 2;">
          <label>Estado *</label>
          <select id="status" class="swal-field">
            ${this.statuses
              .map((s: any) => {
                const value = s.name ?? s;
                return `
                  <option value="${value}"
                    ${p.status === value ? 'selected' : ''}>
                    ${value}
                  </option>
                `;
              })
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

      const commentValue = (
        popup.querySelector('#comment') as HTMLTextAreaElement
      ).value.trim();

      const status = (
        popup.querySelector('#status') as HTMLSelectElement
      ).value;

      // VALIDACIÓN: solo estado obligatorio
      if (!status) {
        Swal.showValidationMessage('El estado es obligatorio');
        return false;
      }

      // payload dinámico
      const payload: any = {
        status,
      };

      // SOLO enviar comment si existe
      if (commentValue) {
        payload.comment = commentValue;
      }

      return payload;
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

  // ================= DELETE =================
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
