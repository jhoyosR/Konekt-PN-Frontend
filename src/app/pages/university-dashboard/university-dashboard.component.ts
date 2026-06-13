import {
  Component,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { StudentService } from '../../services/student.service';

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-university-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './university-dashboard.component.html',
  styleUrl: './university-dashboard.component.css',
})
export class UniversityDashboardComponent
  implements OnInit, AfterViewInit
{
  students: any[] = [];

  totalStudents = 0;

  semesters: Record<string, number> = {};

  universityName = '';

  constructor(
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  ngAfterViewInit(): void {}

  loadStudents(): void {
    const user = JSON.parse(
      sessionStorage.getItem('user') || '{}'
    );

    const universityId = user?.profile?.id;

    this.universityName =
      user?.profile?.name || 'Universidad';

    this.studentService
      .getStudents(1, universityId)
      .subscribe({
        next: (response) => {
          this.students = response.data;

          this.totalStudents =
            response.total ||
            response.data.length;

          this.generateSemesterStats();

          setTimeout(() => {
            this.createChart();
          }, 100);
        },
      });
  }

activeSemesters = 0;

generateSemesterStats(): void {
  this.semesters = {};

  this.students.forEach((student) => {
    const semester = student.semester || 'Sin dato';

    this.semesters[semester] =
      (this.semesters[semester] || 0) + 1;
  });

  this.activeSemesters = Object.keys(this.semesters).length;
}

createChart(): void {
  const canvas = document.getElementById(
    'semesterChart'
  ) as HTMLCanvasElement;

  if (!canvas) return;

  Chart.getChart(canvas)?.destroy();

  const labels = Object.keys(this.semesters);
  const values = Object.values(this.semesters);

  const colors = [
    '#2563eb', // azul
    '#16a34a', // verde
    '#f59e0b', // amarillo
    '#ef4444', // rojo
    '#8b5cf6', // morado
    '#06b6d4', // cyan
    '#f97316', // naranja
    '#84cc16', // verde lima
  ];

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Estudiantes',
          data: values,

          backgroundColor: labels.map(
            (_, i) => colors[i % colors.length]
          ),

          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

  get recentStudents() {
    return this.students.slice(0, 5);
  }
}