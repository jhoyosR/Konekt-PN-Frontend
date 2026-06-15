import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { VacanciesService } from '../../services/vacancies.service';
import { CommonService } from '../../services/common.service';

import { VacancieRequest } from '../../interfaces/vacancie-request';
import { VacancieResponse } from '../../interfaces/vacancie-response';
import localeEsCo from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEsCo, 'es-CO');

@Component({
  selector: 'app-company-vacancies',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './company-vacancies.component.html',
  styleUrl: './company-vacancies.component.css',
})
export class CompanyVacanciesComponent implements OnInit {
  vacancies: VacancieResponse[] = [];
  statuses: any[] = [];
  modalities: any[] = [];
  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(
    private vacanciesService: VacanciesService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadVacancies();
    this.loadCatalogs();
  }
  //Metodo para cargar los estados de una vacante
  loadCatalogs(): void {
    this.commonService.getConstants('vacancie-status').subscribe({
      next: (res) => (this.statuses = res),
      error: (err) => console.error('Error status', err),
    });

    this.commonService.getConstants('modality').subscribe({
      next: (res) => (this.modalities = res),
      error: (err) => console.error('Error modality', err),
    });
  }
  //Metodo para listar las vacantes
  loadVacancies(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const companyId = user?.profile?.id;

    this.vacanciesService
      .getVacancies(this.page, undefined, undefined, companyId)
      .subscribe({
        next: (response) => {
          this.vacancies = response.data;

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
            text: 'No se pudieron cargar las vacantes',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'konekt-swal',
            },
          });
        },
      });
  }
  //Metodos de paginación
  nextPage(): void {
    if (!this.hasNext) return;

    this.page++;
    this.loadVacancies();
  }

  previousPage(): void {
    if (!this.hasPrev) return;

    this.page--;
    this.loadVacancies();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;

    this.page = page;
    this.loadVacancies();
  }
  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  //Modal para crear una vacante (botón crear vacante)
  openCreateVacancyModal(): void {
    Swal.fire({
      title: `<span style="font-family:Segoe UI; font-weight:600;">Crear vacante</span>`,
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

          select.swal-field {
            appearance: none;
            background-color: white;
            text-align: center;
            text-align-last: center;
          }

          textarea.swal-field {
            text-align: center;
          }
        </style>

        <div class="swal-form">

          <!-- TITLE -->
          <div class="swal-group">
            <label>Título<span class="required">*</span></label>
            <input id="title" class="swal-field" />
          </div>

          <!-- SALARY -->
          <div class="swal-group">
            <label>Salario<span class="required">*</span></label>
            <input id="salary" type="number" class="swal-field" />
          </div>

          <!-- DESCRIPTION -->
          <div class="swal-group">
            <label>Descripción<span class="required">*</span></label>
            <textarea id="description" class="swal-field"></textarea>
          </div>

          <!-- REQUIREMENTS -->
          <div class="swal-group">
            <label>Requisitos<span class="required">*</span></label>
            <textarea id="requirements" class="swal-field"></textarea>
          </div>

          <!-- LOCATION -->
          <div class="swal-group">
            <label>Ubicación<span class="required">*</span></label>
            <input id="location" class="swal-field" />
          </div>

          <!-- MODALITY -->
          <div class="swal-group">
            <label>Modalidad<span class="required">*</span></label>
            <select id="modality" class="swal-field">
              <option value="" disabled selected>Seleccione modalidad</option>
              ${this.modalities
                .map((m) => `<option value="${m}">${m}</option>`)
                .join('')}
            </select>
          </div>

          <!-- STATUS -->
          <div class="swal-group" style="grid-column: span 2;">
            <label>Estado<span class="required">*</span></label>
            <select id="status" class="swal-field">
              <option value="" disabled selected>Seleccione estado</option>
              ${this.statuses
                .map((s) => `<option value="${s}">${s}</option>`)
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
        const title = (document.getElementById('title') as HTMLInputElement)
          .value;
        const description = (
          document.getElementById('description') as HTMLTextAreaElement
        ).value;
        const requirements = (
          document.getElementById('requirements') as HTMLTextAreaElement
        ).value;
        const salary = Number(
          (document.getElementById('salary') as HTMLInputElement).value,
        );
        const location = (
          document.getElementById('location') as HTMLInputElement
        ).value;

        const modality = (
          document.getElementById('modality') as HTMLSelectElement
        ).value;
        const status = (document.getElementById('status') as HTMLSelectElement)
          .value;

        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        const companyId = user?.profile?.id;

        if (
          !title ||
          !description ||
          !requirements ||
          !salary ||
          !location ||
          !modality ||
          !status ||
          !companyId
        ) {
          Swal.showValidationMessage('Todos los campos con * son obligatorios');
          return false;
        }

        return {
          title,
          description,
          requirements,
          salary,
          location,
          modality,
          status,
          companyId,
        } as VacancieRequest;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          title: 'Creando vacante...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
          customClass: {
            popup: 'konekt-swal',
          },
        });

        this.vacanciesService.createVacancie(result.value).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Vacante creada',
              confirmButtonColor: '#2563eb',
              customClass: {
                popup: 'konekt-swal',
              },
            });

            this.loadVacancies();
          },

          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear la vacante',
              customClass: {
                popup: 'konekt-swal',
              },
            });
          },
        });
      }
    });
  }
  //Modal para actualizar una vacante (botón actualizar)
  openUpdateVacancyModal(vacancy: VacancieResponse): void {
    Swal.fire({
      title: `<span style="font-family:Segoe UI; font-weight:600;">Actualizar vacante</span>`,
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

          select.swal-field {
            appearance: none;
            background-color: white;
            text-align: center;
            text-align-last: center;
          }

          textarea.swal-field {
            text-align: center;
          }
        </style>

        <div class="swal-form">

          <div class="swal-group">
            <label>Título*</label>
            <input id="title" class="swal-field" value="${vacancy.title}" />
          </div>

          <div class="swal-group">
            <label>Salario*</label>
            <input id="salary" type="number" class="swal-field" value="${vacancy.salary}" />
          </div>

          <div class="swal-group">
            <label>Descripción*</label>
            <textarea id="description" class="swal-field">${vacancy.description}</textarea>
          </div>

          <div class="swal-group">
            <label>Requisitos*</label>
            <textarea id="requirements" class="swal-field">${vacancy.requirements}</textarea>
          </div>

          <div class="swal-group">
            <label>Ubicación*</label>
            <input id="location" class="swal-field" value="${vacancy.location}" />
          </div>

          <div class="swal-group">
            <label>Modalidad*</label>
            <select id="modality" class="swal-field">
              <option value="" disabled>Seleccione modalidad</option>
              ${this.modalities
                .map(
                  (m) =>
                    `<option value="${m}" ${
                      vacancy.modality === m ? 'selected' : ''
                    }>${m}</option>`,
                )
                .join('')}
            </select>
          </div>

          <div class="swal-group" style="grid-column: span 2;">
            <label>Estado*</label>
            <select id="status" class="swal-field">
              <option value="" disabled>Seleccione estado</option>
              ${this.statuses
                .map(
                  (s) =>
                    `<option value="${s}" ${
                      vacancy.status === s ? 'selected' : ''
                    }>${s}</option>`,
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
        const payload: Partial<VacancieRequest> = {
          title: (document.getElementById('title') as HTMLInputElement).value,
          salary: Number(
            (document.getElementById('salary') as HTMLInputElement).value,
          ),
          description: (
            document.getElementById('description') as HTMLTextAreaElement
          ).value,
          requirements: (
            document.getElementById('requirements') as HTMLTextAreaElement
          ).value,
          location: (document.getElementById('location') as HTMLInputElement)
            .value,
          modality: (document.getElementById('modality') as HTMLSelectElement)
            .value,
          status: (document.getElementById('status') as HTMLSelectElement)
            .value,
        };

        if (
          !payload.title ||
          !payload.description ||
          !payload.requirements ||
          !payload.salary ||
          !payload.location ||
          !payload.modality ||
          !payload.status
        ) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
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

        this.vacanciesService
          .updateVacancie(vacancy.id, result.value)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Actualizada',
                confirmButtonColor: '#2563eb',
                customClass: {
                  popup: 'konekt-swal',
                },
              });

              this.loadVacancies();
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la vacante',
                customClass: {
                  popup: 'konekt-swal',
                },
              });
            },
          });
      }
    });
  }
  //Modal para eliminar una vacante (botón eliminar)
  deleteVacancie(id: number): void {
    Swal.fire({
      title: '¿Eliminar vacante?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#2563eb',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'konekt-swal',
      },
    }).then((result) => {
      if (result.isConfirmed) {
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

        this.vacanciesService.deleteVacancie(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminada',
              text: 'Vacante eliminada',
              confirmButtonColor: '#2563eb',
              customClass: {
                popup: 'konekt-swal',
              },
            });

            this.loadVacancies();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar',
              customClass: {
                popup: 'konekt-swal',
              },
            });
          },
        });
      }
    });
  }
}
