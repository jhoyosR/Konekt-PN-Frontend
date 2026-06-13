import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../navbar/navbar.component';

import { UserService } from '../../services/user.service';
import { StudentService } from '../../services/student.service';
import { CompanyService } from '../../services/company.service';
import { UniversityService } from '../../services/university.service';
import { VacanciesService } from '../../services/vacancies.service';
import { ApplicationsService } from '../../services/applications.service';
import { PartnershipService } from '../../services/partnership.service';

import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  totalStudents = 0;
  totalCompanies = 0;
  totalUniversities = 0;
  totalVacancies = 0;
  totalApplications = 0;
  totalPartnerships = 0;
  activeUsers = 0;
  inactiveUsers = 0;
  recentUsers: any[] = [];
  activeVacancies = 0;
  suspendedVacancies = 0;
  closedVacancies = 0;

  constructor(
    private userService: UserService,
    private studentService: StudentService,
    private companyService: CompanyService,
    private universityService: UniversityService,
    private vacanciesService: VacanciesService,
    private applicationsService: ApplicationsService,
    private partnershipService: PartnershipService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.userService.getUsers(1).subscribe((res: any) => {
      const users = res.data || [];

      this.totalUsers = res.total || users.length;

      this.activeUsers = users.filter((u: any) => u.isActive).length;
      this.inactiveUsers = users.filter((u: any) => !u.isActive).length;

      this.recentUsers = users.slice(0, 5);

      setTimeout(() => this.createChart(), 100);
    });

    this.studentService.getStudents(1).subscribe((res: any) => {
      this.totalStudents = res.total || res.data.length;
    });

    this.companyService.getCompanies?.(1)?.subscribe?.((res: any) => {
      this.totalCompanies = res.total || res.data?.length || 0;
    });

    this.universityService.getUniversities(1).subscribe((res: any) => {
      this.totalUniversities = res.total || res.data.length;
    });

    this.vacanciesService.getVacancies(1).subscribe((res: any) => {
      const data = res.data || [];

      this.totalVacancies = res.total || data.length;

      this.activeVacancies = data.filter(
        (v: any) => v.status === 'Activa',
      ).length;
      this.suspendedVacancies = data.filter(
        (v: any) => v.status === 'Suspendida',
      ).length;
      this.closedVacancies = data.filter(
        (v: any) => v.status === 'Cerrada',
      ).length;
    });

    this.applicationsService.getApplications(1).subscribe((res: any) => {
      this.totalApplications = res.total || res.data.length;
    });

    this.partnershipService.getPartnerships(1).subscribe((res: any) => {
      this.totalPartnerships = res.total || res.data.length;
    });
  }

  createChart(): void {
    const canvas = document.getElementById('adminChart') as HTMLCanvasElement;
    if (!canvas) return;

    Chart.getChart(canvas)?.destroy();

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Activos', 'Inactivos'],
        datasets: [
          {
            data: [this.activeUsers, this.inactiveUsers],
            backgroundColor: ['#16a34a', '#dc2626'],
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
