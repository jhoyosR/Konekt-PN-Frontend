import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';

import { StudentService } from '../../services/student.service';
import { Student } from '../../interfaces/student';

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
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    const user = JSON.parse(
      sessionStorage.getItem('user') || '{}',
    );

    const universityId = user?.profile?.id;

    this.studentService
      .getStudents(this.page, universityId)
      .subscribe({
        next: (response) => {
          this.students = response.data;

          console.log('Students response:', response); // Debug log

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
    return Array.from(
      { length: this.pageCount },
      (_, i) => i + 1,
    );
  }
}