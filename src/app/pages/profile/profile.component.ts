import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import Swal from 'sweetalert2';

import { StudentService } from '../../services/student.service';
import { CompanyService } from '../../services/company.service';
import { UniversityService } from '../../services/university.service';
import { CommonService } from '../../services/common.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NavbarComponent } from '../navbar/navbar.component';

interface ProfileField {
  label: string;
  key: string;
  fullWidth?: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: any = {};
  profile: any = {};
  fields: ProfileField[] = [];

  editForm!: FormGroup;
  passwordForm!: FormGroup;

  showEditForm = false;
  showPasswordForm = false;

  showPassword = false;

  careers: string[] = [];
  industries: string[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private studentService: StudentService,
    private companyService: CompanyService,
    private universityService: UniversityService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    const sessionUser = JSON.parse(sessionStorage.getItem('user') || '{}');

    this.user = sessionUser;
    this.profile = sessionUser.profile || {};

    if (this.profile.university) {
      this.profile.universityName = this.profile.university.name;
    }

    this.loadFields();
    this.createForms();

    this.loadCareers();
    this.loadIndustries();
  }

  get f() {
    return this.editForm.controls;
  }

  get p() {
    return this.passwordForm.controls;
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

  private loadIndustries(): void {
    this.commonService.getConstants('industry-type').subscribe({
      next: (response) => {
        this.industries = response;
      },
      error: (error) => {
        console.error('Error cargando industrias', error);
      },
    });
  }

  private createForms(): void {
    switch (this.user.role) {
      case 'student':
        this.editForm = this.fb.group({
          phone: [this.profile.phone || '', Validators.required],
          career: [this.profile.career || '', Validators.required],
          semester: [this.profile.semester || '', Validators.required],
          about: [this.profile.about || '', Validators.required],
        });
        break;

      case 'company':
        this.editForm = this.fb.group({
          industry: [this.profile.industry || '', Validators.required],
          phone: [this.profile.phone || '', Validators.required],
          address: [this.profile.address || '', Validators.required],
          description: [this.profile.description || '', Validators.required],
        });
        break;

      case 'university':
        this.editForm = this.fb.group({
          phone: [this.profile.phone || '', Validators.required],
          address: [this.profile.address || '', Validators.required],
        });
        break;

      default:
        this.editForm = this.fb.group({});
    }

    this.passwordForm = this.fb.group(
      {
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
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private loadFields(): void {
    switch (this.user.role) {
      case 'company':
        this.fields = [
          { label: 'Nombre', key: 'name' },
          { label: 'NIT', key: 'nit' },
          { label: 'Industria', key: 'industry' },
          { label: 'Teléfono', key: 'phone' },
          { label: 'Dirección', key: 'address', fullWidth: true },
          { label: 'Descripción', key: 'description', fullWidth: true },
        ];
        break;

      case 'student':
        this.fields = [
          { label: 'Nombre completo', key: 'fullName' },
          { label: 'Documento', key: 'documentNumber' },
          { label: 'Teléfono', key: 'phone' },
          { label: 'Carrera', key: 'career' },
          { label: 'Semestre', key: 'semester', fullWidth: true },
          { label: 'Universidad', key: 'universityName' },
          { label: 'Acerca de mí', key: 'about', fullWidth: true },
        ];
        break;

      case 'university':
        this.fields = [
          { label: 'Nombre', key: 'name' },
          { label: 'NIT', key: 'nit' },
          { label: 'Teléfono', key: 'phone' },
          { label: 'Dirección', key: 'address' },
        ];
        break;

      default:
        this.fields = [];
    }
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }

  togglePasswordForm(): void {
    Swal.fire({
      title: 'Cambiar contraseña',
      text: '¿Deseas modificar tu contraseña?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showPasswordForm = true;
      }
    });
  }

  cancelPasswordChange(): void {
    this.passwordForm.reset();
    this.showPasswordForm = false;
    this.showPassword = false;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  updateProfile(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const id = this.profile.id;

    let payload: any = {};

    switch (this.user.role) {
      case 'student':
        payload = {
          about: this.editForm.value.about,
          phone: this.editForm.value.phone,
          career: this.editForm.value.career,
          semester: this.editForm.value.semester,
        };
        break;

      case 'company':
        payload = {
          description: this.editForm.value.description,
          industry: this.editForm.value.industry,
          address: this.editForm.value.address,
          phone: this.editForm.value.phone,
        };
        break;

      case 'university':
        payload = {
          address: this.editForm.value.address,
          phone: this.editForm.value.phone,
        };
        break;
    }

    Swal.fire({
      title: '¿Desea actualizar el perfil?',
      icon: 'question',
      showCancelButton: true,
    }).then((result) => {
      if (!result.isConfirmed) return;

      let request$;

      switch (this.user.role) {
        case 'student':
          request$ = this.studentService.updateStudent(id, payload);
          break;
        case 'company':
          request$ = this.companyService.updateCompany(id, payload);
          break;
        case 'university':
          request$ = this.universityService.updateUniversity(id, payload);
          break;
        default:
          return;
      }

      request$.subscribe({
        next: () => {
          const user = JSON.parse(sessionStorage.getItem('user') || '{}');

          user.profile = {
            ...user.profile,
            ...payload,
          };

          sessionStorage.setItem('user', JSON.stringify(user));
          this.profile = user.profile;

          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado',
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.message || 'No se pudo actualizar el perfil',
          });
        },
      });
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const payload = {
      password: this.passwordForm.value.password,
    };

    Swal.fire({
      title: '¿Desea cambiar la contraseña?',
      icon: 'question',
      showCancelButton: true,
    }).then((result) => {
      if (!result.isConfirmed) return;

      let request$;

      switch (this.user.role) {
        case 'student':
          request$ = this.studentService.updateStudent(
            this.profile.id,
            payload,
          );
          break;
        case 'company':
          request$ = this.companyService.updateCompany(
            this.profile.id,
            payload,
          );
          break;
        case 'university':
          request$ = this.universityService.updateUniversity(
            this.profile.id,
            payload,
          );
          break;
        default:
          return;
      }

      request$.subscribe({
        next: () => {
          this.passwordForm.reset();
          this.showPasswordForm = false;
          this.showPassword = false;

          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.message || 'No se pudo cambiar la contraseña',
          });
        },
      });
    });
  }

  goToDashboard(): void {
    switch (this.user.role) {
      case 'student':
        this.router.navigate(['/dashboard/student']);
        break;
      case 'company':
        this.router.navigate(['/dashboard/company']);
        break;
      case 'university':
        this.router.navigate(['/dashboard/university']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
