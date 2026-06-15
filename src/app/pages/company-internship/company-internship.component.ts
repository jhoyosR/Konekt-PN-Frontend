import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { IntershipService } from '../../services/intership.service';
import { IntershipResponse } from '../../interfaces/internship-response';
import { CommonService } from '../../services/common.service';
import { InternshipUpdateService } from '../../services/internship-update.service';
import { Router } from '@angular/router';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-company-internship',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './company-internship.component.html',
  styleUrl: './company-internship.component.css',
})
export class CompanyInternshipComponent implements OnInit {
  internships: IntershipResponse[] = [];

  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;
  statusesIntership: any[] = [];

  constructor(
    private intershipService: IntershipService,
    private commonService: CommonService,
    private internshipUpdateService: InternshipUpdateService,
    private router: Router,
    private fileService: FilesService,
  ) {}

  ngOnInit(): void {
    this.loadInternships();
    this.loadStatusInternship();
  }
  //Metodo para cargar las prácticas de un estudiante en la empresa
  loadInternships(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const companyId = user?.profile?.id;

    this.intershipService
      .getInterships({
        page: this.page,
        companyId: companyId ?? undefined,
      })
      .subscribe({
        next: (res) => {
          this.internships = res.data || [];

          this.total = res.total;
          this.page = res.page;
          this.pageCount = res.page_count;
          this.hasNext = res.has_next;
          this.hasPrev = res.has_prev;
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las prácticas',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }
  //Metodos de paginación
  nextPage(): void {
    if (!this.hasNext) return;
    this.page++;
    this.loadInternships();
  }

  previousPage(): void {
    if (!this.hasPrev) return;
    this.page--;
    this.loadInternships();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.page = page;
    this.loadInternships();
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  //Metodo para cargar los estados de las practicas
  loadStatusInternship(): void {
    this.commonService.getConstants('internship-status').subscribe({
      next: (res) => (this.statusesIntership = res),
      error: (err) => console.error('Error statuses', err),
    });
  }
  //Modal para actualizar una práctica (botón actualizar)
  updateInternship(i: IntershipResponse): void {
    Swal.fire({
      title: `<span style="font-family:Segoe UI; font-weight:600;">Gestionar práctica</span>`,
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

        select.swal-field {
          background: white;
          text-align: center;
          text-align-last: center;
        }
      </style>

      <div class="swal-form">

        <!-- STATUS -->
        <div class="swal-group" style="grid-column: span 2;">
          <label>Estado *</label>
          <select id="status" class="swal-field">
            <option value="" disabled>Seleccione estado</option>
            ${(this.statusesIntership || [])
              .map((s: any) => {
                const value = s.name ?? s;
                return `
                  <option value="${value}" ${
                    i.status === value ? 'selected' : ''
                  }>
                    ${value}
                  </option>
                `;
              })
              .join('')}
          </select>
        </div>

        <!-- START DATE -->
        <div class="swal-group">
          <label>Fecha inicio *</label>
          <input
            id="startDate"
            type="date"
            class="swal-field"
            value="${i.startDate}"
          />
        </div>

        <!-- END DATE -->
        <div class="swal-group">
          <label>Fecha fin *</label>
          <input
            id="endDate"
            type="date"
            class="swal-field"
            value="${i.endDate}"
          />
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
        const startDate = (
          document.getElementById('startDate') as HTMLInputElement
        ).value;
        const endDate = (document.getElementById('endDate') as HTMLInputElement)
          .value;

        if (!status || !startDate || !endDate) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        return {
          status,
          startDate,
          endDate,
          applicationId: i.applicationId,
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

      this.intershipService.updateIntership(i.id, result.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Práctica actualizada',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });

          this.loadInternships();
        },

        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la práctica',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });
        },
      });
    });
  }
  //Modal para eliminar una práctica (botón eliminar)
  deleteInternship(id: number): void {
    Swal.fire({
      title: '¿Eliminar práctica?',
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

        this.intershipService.deleteIntership(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminada',
              text: 'Práctica eliminada correctamente',
              confirmButtonColor: '#2563eb',
              customClass: {
                popup: 'konekt-swal',
              },
            });

            this.loadInternships();
          },

          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la práctica',
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
  //Modal para crear una actualización de una práctica (botón crear seguimiento)
  followInternship(intership: any): void {
    Swal.fire({
      title: `<span style="font-family:Segoe UI; font-weight:600;">Registrar seguimiento</span>`,
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
            placeholder="Ingrese el título"
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
            placeholder="Ingrese la descripción del seguimiento"
          ></textarea>
        </div>

      </div>
    `,

      showCancelButton: true,
      confirmButtonText: 'Guardar',
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
          internshipId: intership.id,
        };
      },
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return;

      Swal.fire({
        title: 'Guardando seguimiento...',
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
        .createInternshipUpdate(result.value)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Seguimiento registrado',
              confirmButtonColor: '#2563eb',
              customClass: {
                popup: 'konekt-swal',
              },
            }).then(() => {
              const url = this.router.serializeUrl(
                this.router.createUrlTree(
                  ['/dashboard/company/internship-update'],
                  {
                    queryParams: {
                      internshipId: intership.id,
                    },
                  },
                ),
              );

              window.open(url, '_blank');
            });
          },

          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo registrar el seguimiento',
              customClass: {
                popup: 'konekt-swal',
              },
            });
          },
        });
    });
  }
  //Metodo para ver las actualizaciones y los documentos cargados de una práctica (botón ver detalles)
  viewInternshipDetails(intership: IntershipResponse): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/dashboard/company/internship-update'], {
        queryParams: {
          internshipId: intership.id,
        },
      }),
    );

    window.open(url, '_blank');
  }
  //Modal para cargar documentos de un practicante - certificado ARL y EPS (botón cargar documentos)
  openDocumentsModal(i: IntershipResponse): void {
    let arlFile: File | null = null;
    let epsFile: File | null = null;

    const arlUrl = i.arlCertificationUrl || null;
    const epsUrl = i.epsCertificationUrl || null;

    Swal.fire({
      title: 'Documentos del practicante',
      width: '520px',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      customClass: { popup: 'konekt-swal' },

      html: `
      <style>
        .toggle {
          display:flex;
          justify-content:center;
          gap:10px;
          margin-bottom:12px;
        }

        .toggle button {
          padding:6px 12px;
          border-radius:20px;
          border:1px solid #d1d5db;
          background:#fff;
          cursor:pointer;
          font-size:12px;
        }

        .toggle button.active {
          background:#2563eb;
          color:#fff;
          border-color:#2563eb;
        }

        .box {
          border:1px solid #e5e7eb;
          border-radius:10px;
          padding:12px;
        }

        .hidden {
          display:none;
        }

        .title {
          font-weight:600;
          font-size:14px;
          margin-bottom:8px;
        }

        .btn {
          background:#2563eb;
          color:#fff;
          border:none;
          padding:6px 10px;
          border-radius:6px;
          cursor:pointer;
          font-size:12px;
        }

        .btn-view {
          background:#10b981;
          color:#fff;
          border:none;
          padding:6px 10px;
          border-radius:6px;
          cursor:pointer;
          font-size:12px;
          margin-top:6px;
          display:inline-block;
          text-decoration:none;
        }

        .preview {
          margin-top:8px;
          font-size:12px;
          color:#111;
        }
      </style>

      <div class="toggle">
        <button id="tabArl" class="active">ARL</button>
        <button id="tabEps">EPS</button>
      </div>

      <!-- ARL -->
      <div id="arlBox" class="box">
        <div class="title">Certificado ARL</div>

        <input type="file" id="arlInput" hidden accept=".pdf,.jpg,.png"/>
        <button class="btn" id="btnArlFile">Seleccionar archivo</button>

        ${
          arlUrl
            ? `<a class="btn-view" href="${arlUrl}" target="_blank">Ver archivo actual</a>`
            : `<div style="font-size:12px;color:#6b7280;margin-top:6px;">Sin archivo</div>`
        }

        <div id="arlPreview" class="preview"></div>
      </div>

      <!-- EPS -->
      <div id="epsBox" class="box hidden">
        <div class="title">Certificado EPS</div>

        <input type="file" id="epsInput" hidden accept=".pdf,.jpg,.png"/>
        <button class="btn" id="btnEpsFile">Seleccionar archivo</button>

        ${
          epsUrl
            ? `<a class="btn-view" href="${epsUrl}" target="_blank">Ver archivo actual</a>`
            : `<div style="font-size:12px;color:#6b7280;margin-top:6px;">Sin archivo</div>`
        }

        <div id="epsPreview" class="preview"></div>
      </div>
    `,

      didOpen: () => {
        const tabArl = document.getElementById('tabArl')!;
        const tabEps = document.getElementById('tabEps')!;
        const arlBox = document.getElementById('arlBox')!;
        const epsBox = document.getElementById('epsBox')!;

        const arlInput = document.getElementById(
          'arlInput',
        ) as HTMLInputElement;
        const epsInput = document.getElementById(
          'epsInput',
        ) as HTMLInputElement;

        const arlPreview = document.getElementById('arlPreview')!;
        const epsPreview = document.getElementById('epsPreview')!;

        tabArl.onclick = () => {
          tabArl.classList.add('active');
          tabEps.classList.remove('active');
          arlBox.classList.remove('hidden');
          epsBox.classList.add('hidden');
        };

        tabEps.onclick = () => {
          tabEps.classList.add('active');
          tabArl.classList.remove('active');
          epsBox.classList.remove('hidden');
          arlBox.classList.add('hidden');
        };

        document.getElementById('btnArlFile')!.onclick = () => arlInput.click();
        document.getElementById('btnEpsFile')!.onclick = () => epsInput.click();

        arlInput.onchange = () => {
          arlFile = arlInput.files?.[0] || null;
          arlPreview.textContent = arlFile
            ? `Archivo seleccionado: ${arlFile.name}`
            : '';
        };

        epsInput.onchange = () => {
          epsFile = epsInput.files?.[0] || null;
          epsPreview.textContent = epsFile
            ? `Archivo seleccionado: ${epsFile.name}`
            : '';
        };
      },

      preConfirm: () => {
        return { arlFile, epsFile };
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      const { arlFile, epsFile } = result.value;
      const id = i.id;

      if (!arlFile && !epsFile) return;

      Swal.fire({
        title: '¿Confirmas la carga del documento?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cerrar',
        customClass: { popup: 'konekt-swal' },
      }).then((confirm) => {
        if (!confirm.isConfirmed) return;

        Swal.fire({
          title: 'Subiendo documento...',
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
          customClass: { popup: 'konekt-swal' },
        });

        const tasks: Promise<any>[] = [];

        if (arlFile) {
          const fd = new FormData();
          fd.append('file', arlFile);

          tasks.push(
            this.fileService
              .uploadFile(fd)
              .toPromise()
              .then((res: any) => {
                const fileName = res.fileName || res.filename;

                return this.intershipService
                  .updateIntership(id, {
                    arlCertification: fileName,
                  })
                  .toPromise();
              }),
          );
        }

        if (epsFile) {
          const fd = new FormData();
          fd.append('file', epsFile);

          tasks.push(
            this.fileService
              .uploadFile(fd)
              .toPromise()
              .then((res: any) => {
                const fileName = res.fileName || res.filename;

                return this.intershipService
                  .updateIntership(id, {
                    epsCertification: fileName,
                  })
                  .toPromise();
              }),
          );
        }

        Promise.all(tasks).then(() => {
          this.loadInternships();

          Swal.fire({
            icon: 'success',
            title: 'Documento actualizado',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'konekt-swal' },
          });
        });
      });
    });
  }
}
