import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApplicationsService } from '../../services/applications.service';
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
  studentName = '';
  totalApplications = 0;
  activeApplications = 0;
  suspendedApplications = 0;
  cancelledApplications = 0;
  recentApplications: any[] = [];

  constructor(private applicationsService: ApplicationsService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }
  //Metodo para cargar la dashboard de estudiante
  loadDashboard(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const studentId = user?.profile?.id;

    this.studentName =
      user?.profile?.fullName || user?.profile?.name || 'Estudiante';

    this.applicationsService
      .getApplications(1, undefined, studentId)
      .subscribe({
        next: (response) => {
          this.applications = response?.data || [];

          this.totalApplications = response?.total || this.applications.length;

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

          setTimeout(() => {
            this.createChart();
          }, 100);
        },
      });
  }
  //Metodo para cargar el gráfico
  createChart(): void {
    const canvas = document.getElementById(
      'applicationsChart',
    ) as HTMLCanvasElement;

    if (!canvas) return;

    Chart.getChart(canvas)?.destroy();

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

            borderColor: ['#16a34a', '#2563eb', '#dc2626'],

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
}
