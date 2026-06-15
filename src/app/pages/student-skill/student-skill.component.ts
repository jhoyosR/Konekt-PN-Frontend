import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { StudentService } from '../../services/student.service';

import { SkillResponse } from '../../interfaces/skill-response';
import { StudentRegisterResponse } from '../../interfaces/student-register-response';
import { NavbarComponent } from '../navbar/navbar.component';
import { SkillService } from '../../services/skill.service';
import { Student } from '../../interfaces/student';

@Component({
  selector: 'app-student-skill',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './student-skill.component.html',
  styleUrl: './student-skill.component.css',
})
export class StudentSkillComponent implements OnInit {
  student: Student | null = null;

  skills: SkillResponse[] = [];

  constructor(
    private studentService: StudentService,
    private skillService: SkillService,
  ) {}

  ngOnInit(): void {
    this.loadStudent();
  }
  //Modal para crear habilidad (botón crear habilidad)
  createSkill(): void {
    if (!this.student) {
      return;
    }

    this.skillService.getSkills().subscribe({
      next: (response: SkillResponse[]) => {
        Swal.fire({
          title: `<span style="font-family:Segoe UI; font-weight:600;">Agregar habilidad</span>`,
          width: '600px',
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
              display: flex;
              flex-direction: column;
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

            select.swal-field {
              appearance: none;
              text-align: center;
              text-align-last: center;
            }

            .swal2-popup {
              overflow: visible !important;
            }

            .swal2-container {
              overflow-y: auto !important;
            }
          </style>

          <div class="swal-form">

            <div class="swal-group">
              <label>
                Habilidad
                <span class="required">*</span>
              </label>

              <select
                id="skillId"
                class="swal-field"
              >
                <option value="" disabled selected>
                  Seleccione una habilidad
                </option>

                ${response
                  .map(
                    (skill: SkillResponse) => `
                      <option value="${skill.id}">
                        ${skill.name}
                      </option>
                    `,
                  )
                  .join('')}
              </select>
            </div>

          </div>
        `,

          showCancelButton: true,
          confirmButtonText: 'Agregar',
          cancelButtonText: 'Cancelar',

          confirmButtonColor: '#2563eb',
          cancelButtonColor: '#ef4444',

          preConfirm: () => {
            const popup = Swal.getPopup();

            const skillId = Number(
              (popup?.querySelector('#skillId') as HTMLSelectElement)?.value,
            );

            if (!skillId) {
              Swal.showValidationMessage('Debe seleccionar una habilidad');

              return false;
            }

            return {
              skillId,
            };
          },
        }).then((result) => {
          if (!result.isConfirmed || !result.value) {
            return;
          }

          Swal.fire({
            title: 'Registrando habilidad...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
            customClass: {
              popup: 'konekt-swal',
            },
          });

          this.skillService
            .createSkillStudent(this.student!.id, result.value.skillId)
            .subscribe({
              next: () => {
                Swal.close();

                Swal.fire({
                  icon: 'success',
                  title: 'Habilidad agregada',
                  confirmButtonColor: '#2563eb',
                  customClass: {
                    popup: 'konekt-swal',
                  },
                });

                this.loadStudent();
              },

              error: () => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo agregar la habilidad, verifica si ya existe',
                  confirmButtonColor: '#2563eb',
                  customClass: {
                    popup: 'konekt-swal',
                  },
                });
              },
            });
        });
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las habilidades',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }
  //Metodo para cargar las habilidades de un estudiante por id
  loadStudent(): void {
    const session = sessionStorage.getItem('user');

    if (!session) {
      return;
    }

    const user = JSON.parse(session);

    const studentId = user?.profile?.id;

    if (!studentId) {
      return;
    }

    this.studentService.getStudentById(studentId).subscribe({
      next: (student: Student) => {
        this.student = student;
        this.skills = student.skills || [];
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las habilidades',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }
  //Modal para eliminar una habilidad (botón eliminar)
  deleteSkill(skill: SkillResponse): void {
    if (!this.student) {
      return;
    }

    Swal.fire({
      title: `<span style="font-family:Segoe UI; font-weight:600;">Eliminar habilidad</span>`,
      html: `
      <div style="
        font-family: Inter, sans-serif;
        text-align:center;
        font-size:14px;
        color:#374151;
      ">
        ¿Deseas eliminar la habilidad
        <br><br>
        <strong>${skill.name}</strong>?
      </div>
    `,
      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',

      customClass: {
        popup: 'konekt-swal',
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      Swal.fire({
        title: 'Eliminando habilidad...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: 'konekt-swal',
        },
      });

      this.skillService
        .deleteSkillStudent(this.student!.id, skill.id)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Habilidad eliminada',
              confirmButtonColor: '#2563eb',
              customClass: {
                popup: 'konekt-swal',
              },
            });

            this.loadStudent();
          },

          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la habilidad',
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
