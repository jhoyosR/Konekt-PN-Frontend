import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { VacanciesService } from '../../services/vacancies.service';
import { VacancieResponse } from '../../interfaces/vacancie-response';
import { ApplicationsService } from '../../services/applications.service';

import localeEsCo from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { CompanyService } from '../../services/company.service';

type VacancieUI = VacancieResponse & { expanded: boolean };

registerLocaleData(localeEsCo, 'es-CO');

@Component({
  selector: 'app-student-vacancies',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NgSelectModule, ReactiveFormsModule],
  templateUrl: './student-vacancies.component.html',
  styleUrl: './student-vacancies.component.css',
})
export class StudentVacanciesComponent implements OnInit {
  vacancies: VacancieUI[] = [];
  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;
  companies: any[] = [];
  industries: string[] = [];
  modalities: string[] = [];
  filtersForm!: FormGroup;
  currentFilters: any = {};
  studentId!: number;

  constructor(
    private fb: FormBuilder,
    private vacanciesService: VacanciesService,
    private applicationsService: ApplicationsService,
    private commonService: CommonService,
    private companyServie: CompanyService,
  ) {}

  ngOnInit(): void {
    this.initFiltersForm();
    this.loadCatalogs();
    this.loadCompanies();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.studentId = user?.profile?.id;
    this.loadVacancies();
  }

  //Metodo para inicializar los filtros que se esperan
  private initFiltersForm(): void {
    this.filtersForm = this.fb.group({
      title: [''],
      location: [''],
      modality: [null],
      industry: [null],
      salary: [null],
      companyId: [null],
    });
  }

  //Metodo para cargar las industrias y las modalidades
  private loadCatalogs(): void {
    this.commonService.getConstants('industry-type').subscribe({
      next: (res) => {
        this.industries = res;
      },
      error: (err) => console.error('Error loading industries', err),
    });

    this.commonService.getConstants('modality').subscribe({
      next: (res) => {
        this.modalities = res;
      },
      error: (err) => console.error('Error loading modalities', err),
    });
  }
  //Metodo para cargar las empresas
  private loadCompanies(): void {
    this.companyServie.getCompanies(undefined, true).subscribe({
      next: (res: any) => {
        this.companies = res.data ?? res;
      },
      error: (err) => {
        console.error('Error loading companies', err);
      },
    });
  }
  //Metodo que captura y aplica los filtros
  applyFilters(): void {
    this.page = 1;

    const raw = this.filtersForm.value;

    this.currentFilters = {
      title: raw.title?.trim() || undefined,
      location: raw.location?.trim() || undefined,
      modality: raw.modality || undefined,
      industry: raw.industry || undefined,
      salary: raw.salary || undefined,
      companyId: raw.companyId || undefined,
    };

    this.loadVacancies();
  }

  //Metodo que carga las vacantes
  loadVacancies(): void {
    const f = this.currentFilters ?? {};

    const studentId = this.studentId;
    const notAppliedByStudentId = this.studentId;

    this.vacanciesService
      .getVacancies(
        this.page,
        notAppliedByStudentId,
        'Activa',
        f.companyId,
        f.title,
        f.location,
        f.modality,
        f.salary,
        f.industry,
      )
      .subscribe({
        next: (response: any) => {
          this.vacancies = response.data.map((v: any) => ({
            ...v,
            expanded: false,
          }));
          console.log('this.vacancies', this.vacancies);
          console.log('this.page', this.page);
          console.log('notAppliedByStudentId', notAppliedByStudentId);
          console.log('f.companyId,', f.companyId);
          console.log('f.title', f.title);
          console.log('f.location', f.location);
          console.log('f.modality', f.modality);
          console.log('f.salary', f.salary);
          console.log('f.industry', f.industry);
          console.log('studentId', studentId);

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
  //Metodo para aplicar una vacante (botón postularme)
  applyVacancy(vacancy: VacancieResponse): void {
    Swal.fire({
      title: '¿Postularte a esta vacante?',
      text: vacancy.title,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, postularme',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      customClass: { popup: 'konekt-swal' },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enviando postulación...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          customClass: { popup: 'konekt-swal' },
        });

        this.applicationsService.createApplication(vacancy.id!).subscribe({
          next: () => {
            this.loadVacancies();

            Swal.fire({
              icon: 'success',
              title: 'Postulación enviada',
              text: 'Te has postulado correctamente a la vacante.',
              confirmButtonColor: '#2563eb',
              customClass: { popup: 'konekt-swal' },
            });
          },

          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo postular',
              confirmButtonColor: '#2563eb',
              customClass: { popup: 'konekt-swal' },
            });
          },
        });
      }
    });
  }
  //Metodo para abrir la foto de perfil de una empresa en otra ventana
  openPhoto(url: string): void {
    window.open(url, '_blank');
  }
}
