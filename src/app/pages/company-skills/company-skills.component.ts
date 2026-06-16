import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { SkillService } from '../../services/skill.service';
import { SkillResponse } from '../../interfaces/skill-response';
import { VacanciesService } from '../../services/vacancies.service';
import { VacancieResponse } from '../../interfaces/vacancie-response';

@Component({
  selector: 'app-company-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-skills.component.html',
  styleUrl: './company-skills.component.css',
})
export class CompanySkillsComponent implements OnInit {
  vacancyId!: number;

  vacancy: VacancieResponse | null = null;
  skills: SkillResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private vacanciesService: VacanciesService,
    private skillService: SkillService,
  ) {}

  ngOnInit(): void {
    this.vacancyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadVacancy();
  }

  // Cargar vacante + skills
  loadVacancy(): void {
    if (!this.vacancyId) return;

    this.vacanciesService.getVacancieById(this.vacancyId).subscribe({
      next: (vacancy: VacancieResponse) => {
        this.vacancy = vacancy;
        this.skills = vacancy.skills || [];
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la vacante',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }

  // Eliminar skill de vacante
  deleteSkill(skill: SkillResponse): void {
    if (!this.vacancyId) return;

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
      if (!result.isConfirmed) return;

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

      this.skillService.deleteSkillVacancie(this.vacancyId, skill.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Habilidad eliminada',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'konekt-swal',
            },
          });

          this.loadVacancy();
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
