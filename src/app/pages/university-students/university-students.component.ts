import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';

import { StudentService } from '../../services/student.service';
import { Student } from '../../interfaces/student';
import { Router } from '@angular/router';
import { IntershipService } from '../../services/intership.service';

@Component({
  selector: 'app-university-students',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './university-students.component.html',
  styleUrl: './university-students.component.css',
})
export class UniversityStudentsComponent implements OnInit {
  students: Student[] = [];
  page = 1;
  total = 0;
  pageCount = 0;
  hasNext = false;
  hasPrev = false;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private intershipService: IntershipService,
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }
  //Metodo para cargar los estudiantes
  loadStudents(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const universityId = user?.profile?.id;

    this.studentService.getStudents(this.page, universityId).subscribe({
      next: (response) => {
        this.students = response.data;

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
          text: 'No se pudieron cargar los estudiantes',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }
  //Metodo para abrir la practica de un estudiante seleccionado (botón gestionar práctica)
  managePractice(studentId: number): void {
    this.intershipService.getInterships({ studentId }).subscribe({
      next: (response) => {
        const interships = response.data || [];

        if (interships.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin práctica registrada',
            text: 'El estudiante no tiene una práctica asociada.',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'konekt-swal',
            },
          });

          return;
        }

        const url = this.router.serializeUrl(
          this.router.createUrlTree(['/dashboard/university/intership'], {
            queryParams: { studentId },
          }),
        );

        window.open(url, '_blank');
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo verificar la práctica del estudiante',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }
  //Metodos de paginación
  nextPage(): void {
    if (!this.hasNext) return;

    this.page++;
    this.loadStudents();
  }

  previousPage(): void {
    if (!this.hasPrev) return;

    this.page--;
    this.loadStudents();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;

    this.page = page;
    this.loadStudents();
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  //Metodo para abrir la foto de perfil del estudiante en otra ventana
  openStudentPhoto(url: string): void {
    window.open(url, '_blank');
  }
}
