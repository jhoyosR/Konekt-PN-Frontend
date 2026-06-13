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
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.css',
})
export class CompanyDashboardComponent implements OnInit {
  applications: any[] = [];

  recentApplications: any[] = [];

  topUniversities: [string, number][] = [];

  companyName = '';

  totalApplications = 0;

  activeApplications = 0;
  suspendedApplications = 0;
  cancelledApplications = 0;

  universities: Record<string, number> = {};

  private chart?: Chart;

  constructor(private applicationsService: ApplicationsService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const companyId = user?.profile?.id;

    this.companyName = user?.profile?.name || 'Empresa';

    this.applicationsService.getApplications(1, companyId).subscribe({
      next: (response) => {
        console.log('Dashboard response:', response);

        this.applications = response?.data || [];

        this.totalApplications = response?.total ?? this.applications.length;

        this.activeApplications = this.applications.filter(
          (a) => a?.status === 'Activa',
        ).length;

        this.suspendedApplications = this.applications.filter(
          (a) => a?.status === 'Suspendida',
        ).length;

        this.cancelledApplications = this.applications.filter(
          (a) => a?.status === 'Cancelada' || a?.status === 'Cerrada',
        ).length;

        this.recentApplications = [...this.applications].slice(0, 5);

        this.buildUniversityStats();

        setTimeout(() => {
          this.createChart();
        }, 100);
      },

      error: (error) => {
        console.error('Error dashboard:', error);
      },
    });
  }

  buildUniversityStats(): void {
    this.universities = {};

    this.applications.forEach((app) => {
      const university = app?.student?.university?.name ?? 'Sin universidad';

      this.universities[university] = (this.universities[university] || 0) + 1;
    });

    this.topUniversities = Object.entries(this.universities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  createChart(): void {
    const canvas = document.getElementById(
      'applicationsChart',
    ) as HTMLCanvasElement | null;

    if (!canvas) {
      console.error('No se encontró el canvas applicationsChart');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Activas', 'Suspendidas', 'Canceladas'],
        datasets: [
          {
            data: [
              this.activeApplications,
              this.suspendedApplications,
              this.cancelledApplications,
            ],
            backgroundColor: ['#16a34a', '#2563eb', '#dc2626'],
            borderWidth: 0,
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
