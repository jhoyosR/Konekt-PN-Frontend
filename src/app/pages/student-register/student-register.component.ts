import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { UniversityService } from '../../services/university.service';
import { University } from '../../interfaces/university';
import { StudentRegisterService } from '../../services/student-register.service';
import { CommonService } from '../../services/common.service';
import Swal from 'sweetalert2';
import { StudentRegisterRequest } from '../../interfaces/student-register-request';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './student-register.component.html',
  styleUrl: './student-register.component.css',
})
export class StudentRegisterComponent implements OnInit {
  showPassword = false;
  registerForm: FormGroup;
  universities: University[] = [];
  allUniversities: University[] = [];
  displayUniversities: University[] = [];
  isSearchMode = false;
  page = 1;
  loading = false;
  hasMore = true;
  careers: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private universityService: UniversityService,
    private commonService: CommonService,
    private studentRegisterService: StudentRegisterService,
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/,
            ),
          ],
        ],

        confirmPassword: ['', Validators.required],

        fullName: ['', Validators.required],

        about: ['', Validators.required],

        documentNumber: ['', Validators.required],

        career: [null, Validators.required],

        phone: ['', Validators.required],

        semester: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
        ],

        universityId: [null, Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  ngOnInit(): void {
    this.loadUniversities();
    this.loadCareers();
  }

  private loadUniversities(): void {
    if (this.loading || !this.hasMore || this.isSearchMode) {
      return;
    }

    this.loading = true;

    this.universityService.getUniversities(this.page).subscribe({
      next: (response) => {
        const data = response.data ?? [];

        this.universities = [...this.universities, ...data];

        // lo que ve el select
        this.displayUniversities = [...this.universities];

        if (data.length < 10) {
          this.hasMore = false;
        }

        this.page++;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }
  loadAllUniversities(): void {
    this.loading = true;

    this.universityService.getUniversities(undefined, true).subscribe({
      next: (response: any) => {
        this.allUniversities = response ?? [];

        // el select muestra TODAS
        this.displayUniversities = [...this.allUniversities];

        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }
  allUniversitiesLoaded = false;

  onUniversitySearch(event: { term: string }): void {
    const term = event.term?.trim();

    if (!term) {
      this.isSearchMode = false;

      // vuelve a mostrar las paginadas
      this.displayUniversities = [...this.universities];

      return;
    }

    this.isSearchMode = true;

    if (!this.allUniversitiesLoaded) {
      this.allUniversitiesLoaded = true;
      this.loadAllUniversities();
    }
  }
  onScrollEnd(): void {
    if (this.isSearchMode) {
      return;
    }

    this.loadUniversities();
  }

  private loadCareers(): void {
    this.commonService.getConstants('career').subscribe({
      next: (response) => {
        this.careers = response;
      },
      error: (error) => {
        console.error('Error cargando carreras', error);
      },
    });
  }

  passwordMatchValidator(form: any) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    const confirmControl = form.get('confirmPassword');

    if (!confirmControl) return null;

    if (password !== confirmPassword) {
      confirmControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmControl.hasError('passwordMismatch')) {
      const errors = confirmControl.errors;

      if (errors) {
        delete errors['passwordMismatch'];

        if (Object.keys(errors).length === 0) {
          confirmControl.setErrors(null);
        } else {
          confirmControl.setErrors(errors);
        }
      }
    }

    return null;
  }

  Studentregister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const data: StudentRegisterRequest = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      fullName: this.registerForm.value.fullName,
      about: this.registerForm.value.about,
      documentNumber: this.registerForm.value.documentNumber,
      career: this.registerForm.value.career,
      phone: this.registerForm.value.phone,
      semester: Number(this.registerForm.value.semester),
      universityId: Number(this.registerForm.value.universityId),
    };

    Swal.fire({
      title: 'Registrando estudiante...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'konekt-swal',
      },
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.studentRegisterService.register(data).subscribe({
      next: (response) => {
        console.log('Register success', response);

        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'El estudiante fue creado correctamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/');
          }
        });
      },

      error: (error) => {
        console.error('Register error', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error?.error?.message ||
            error?.message ||
            'No se pudo registrar el estudiante.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get f() {
    return this.registerForm.controls;
  }

  goToLogin(): void {
    this.router.navigate(['/']);
  }

  goToRoles(): void {
    this.router.navigate(['/roles']);
  }
}
