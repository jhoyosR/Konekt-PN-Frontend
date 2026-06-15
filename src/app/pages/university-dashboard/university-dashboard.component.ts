import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  Legend,
);

@Component({
  selector: 'app-university-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './university-dashboard.component.html',
  styleUrl: './university-dashboard.component.css',
})
export class UniversityDashboardComponent implements OnInit {
  students: any[] = [];
  totalStudents = 0;
  semesters: Record<string, number> = {};
  universityName = '';
  activeSemesters = 0;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }
  //Metodo para cargar los estudiantes
  loadStudents(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const universityId = user?.profile?.id;

    this.universityName = user?.profile?.name || 'Universidad';

    this.studentService.getStudents(1, universityId).subscribe({
      next: (response) => {
        this.students = response.data;

        this.totalStudents = response.total || response.data.length;

        this.generateSemesterStats();

        setTimeout(() => {
          this.createChart();
        }, 100);
      },
    });
  }
  //Metodo para generar los semestres de los estudiantes
  generateSemesterStats(): void {
    this.semesters = {};

    this.students.forEach((student) => {
      const semester = student.semester || 'Sin dato';

      this.semesters[semester] = (this.semesters[semester] || 0) + 1;
    });

    this.activeSemesters = Object.keys(this.semesters).length;
  }
  //Metodo para crear el gráfico
  createChart(): void {
    const canvas = document.getElementById(
      'semesterChart',
    ) as HTMLCanvasElement;

    if (!canvas) return;

    Chart.getChart(canvas)?.destroy();

    const labels = Object.keys(this.semesters);
    const values = Object.values(this.semesters);

    const colors = [
      '#2563eb',
      '#16a34a',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#06b6d4',
      '#f97316',
      '#84cc16',
    ];

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Estudiantes',
            data: values,

            backgroundColor: labels.map((_, i) => colors[i % colors.length]),

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
