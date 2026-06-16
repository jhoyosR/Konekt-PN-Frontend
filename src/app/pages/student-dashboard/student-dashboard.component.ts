import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApplicationsService } from '../../services/applications.service';
import { VacanciesService } from '../../services/vacancies.service';
import { VacancieResponse } from '../../interfaces/vacancie-response';

import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent implements OnInit {
  applications: any[] = [];
  vacancies: VacancieResponse[] = [];

  studentName = '';

  totalApplications = 0;
  activeApplications = 0;
  suspendedApplications = 0;
  cancelledApplications = 0;

  recentApplications: any[] = [];
  hasApplications = false;

  constructor(
    private applicationsService: ApplicationsService,
    private vacanciesService: VacanciesService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadRecommendedVacancies();
  }

  // =========================
  // POSTULACIONES
  // =========================
  loadDashboard(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const studentId = user?.profile?.id;

    this.studentName =
      user?.profile?.fullName || user?.profile?.name || 'Estudiante';

    this.applicationsService.getApplications(1, undefined, studentId).subscribe({
      next: (response) => {
        this.applications = response?.data || [];

        this.totalApplications = this.applications.length;

        this.activeApplications = this.applications.filter(
          (a) => a.status === 'Activa',
        ).length;

        this.suspendedApplications = this.applications.filter(
          (a) => a.status === 'Suspendida',
        ).length;

        this.cancelledApplications = this.applications.filter(
          (a) => a.status === 'Cancelada' || a.status === 'Cerrada',
        ).length;

        this.recentApplications = this.applications.slice(0, 5);

        this.hasApplications = this.applications.length > 0;

        if (this.hasApplications) {
          setTimeout(() => this.createChart(), 100);
        }
      },
      error: () => {
        this.hasApplications = false;
      },
    });
  }

  // =========================
  // GRAFICO SOLO SI HAY DATOS
  // =========================
  createChart(): void {
    const canvas = document.getElementById(
      'applicationsChart',
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const chart = Chart.getChart(canvas);
    if (chart) chart.destroy();

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Activas', 'Suspendidas', 'Cerradas'],
        datasets: [
          {
            data: [
              this.activeApplications,
              this.suspendedApplications,
              this.cancelledApplications,
            ],
            backgroundColor: ['#16a34a', '#2563eb', '#dc2626'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

//Metodo para mostrar las vacantes recomendadas
loadRecommendedVacancies(): void {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const studentId = user?.profile?.id;

  this.vacanciesService.getVacanciesByStudent(studentId).subscribe({
    next: (res: any) => {
      this.vacancies = (res.data || []).slice(0, 3);
      console.log("vacantes", this.vacancies);
    },
    error: () => {
      this.vacancies = [];
    },
  });
}
}