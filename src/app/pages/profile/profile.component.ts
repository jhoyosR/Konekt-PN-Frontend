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
import { FilesService } from '../../services/files.service';

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

  // =========================
  // ✅ NUEVO: PROFILE PHOTO
  // =========================
  selectedFile: File | null = null;
  profileImagePreview: string = '';
  selectedResume: File | null = null;
resumePreview: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private studentService: StudentService,
    private companyService: CompanyService,
    private universityService: UniversityService,
    private commonService: CommonService,
    private fileService: FilesService,
  ) {}

ngOnInit(): void {
  const sessionUser = JSON.parse(sessionStorage.getItem('user') || '{}');

  this.user = sessionUser;
  this.profile = sessionUser.profile || {};

  // ✅ NORMALIZAR FOTO AL ENTRAR
  this.profileImagePreview =
    this.profile.profilePhotoUrl ||
    this.profile.profilePhoto ||
    null;

  console.log('🖼 FOTO INICIAL CARGADA:', this.profileImagePreview);

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
  getProfilePhoto(): string | null {
  return this.profile.profilePhotoUrl || this.profile.profilePhoto || null;
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
          { label: 'Semestre', key: 'semester'},
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

  // =========================
  // 🟢 NUEVO: PHOTO HANDLERS
  // =========================

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
onResumeSelected(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedResume = file;
}
updateProfilePhoto(): void {
  if (!this.selectedFile) return;

  Swal.fire({
    title: '¿Actualizar foto de perfil?',
    text: 'Se reemplazará la imagen actual',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, actualizar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#ef4444',
    customClass: {
      popup: 'konekt-swal',
    },
  }).then((result) => {
    if (!result.isConfirmed) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile!);

    this.fileService.uploadFile(formData).subscribe({
      next: (res) => {
        const fileName = res.fileName || res.filename;
        const payload = { profilePhoto: fileName };
        const id = this.profile.id;

        let update$;
        let refresh$;

        // =========================
        // 🔥 UPDATE POR ROL
        // =========================
        switch (this.user.role) {
          case 'student':
            update$ = this.studentService.updateStudent(id, payload);
            refresh$ = this.studentService.getStudentById(id);
            break;

          case 'company':
            update$ = this.companyService.updateCompany(id, payload);
            refresh$ = this.companyService.getCompanyById(id);
            break;

          case 'university':
            update$ = this.universityService.updateUniversity(id, payload);
            refresh$ = this.universityService.getUniversityById(id);
            break;

          default:
            console.warn('Rol no soportado para actualización de foto');
            return;
        }

        // =========================
        // UPDATE
        // =========================
        update$.subscribe({
          next: () => {
            // =========================
            // REFRESH
            // =========================
            refresh$.subscribe({
              next: (entity: any) => {
                const photo =
                  entity.profilePhotoUrl ||
                  entity.profilePhoto ||
                  fileName;

                this.profile = {
                  ...this.profile,
                  ...entity,
                };

                this.profile.profilePhoto = photo;
                this.profile.profilePhotoUrl = photo;
                this.profileImagePreview = photo;

                this.selectedFile = null;

                // =========================
                // SESSION UPDATE
                // =========================
                const user = JSON.parse(
                  sessionStorage.getItem('user') || '{}'
                );

                user.profile = {
                  ...user.profile,
                  profilePhoto: photo,
                  profilePhotoUrl: photo,
                };

                sessionStorage.setItem('user', JSON.stringify(user));

                Swal.fire({
                  icon: 'success',
                  title: 'Foto actualizada',
                  timer: 1500,
                  showConfirmButton: false,
                  customClass: {
                    popup: 'konekt-swal',
                  },
                });
              },
              error: (err) => {
                console.error('❌ REFRESH ERROR:', err);
              },
            });
          },
          error: (err) => {
            console.error('❌ UPDATE ERROR:', err);

            Swal.fire({
              icon: 'error',
              title: 'Error actualizando foto',
              text: err?.message || 'Error inesperado',
              confirmButtonColor: '#ef4444',
              customClass: {
                popup: 'konekt-swal',
              },
            });
          },
        });
      },
      error: (err) => {
        console.error('❌ UPLOAD ERROR:', err);

        Swal.fire({
          icon: 'error',
          title: 'Error subiendo archivo',
          text: err?.message || 'Error inesperado',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  });
}
updateResume(): void {
  if (!this.selectedResume || this.user.role !== 'student') return;

  Swal.fire({
    title: '¿Actualizar hoja de vida?',
    text: 'Se reemplazará el archivo actual',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, actualizar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#ef4444',
    customClass: {
      popup: 'konekt-swal',
    },
  }).then((result) => {
    if (!result.isConfirmed) return;

    const formData = new FormData();
    formData.append('file', this.selectedResume!);

    this.fileService.uploadFile(formData).subscribe({
      next: (res) => {
        const fileName = res.fileName || res.filename;

        const payload = {
          resume: fileName, // 👈 CAMPO NUEVO BACKEND
        };

        const id = this.profile.id;

        this.studentService.updateStudent(id, payload).subscribe({
          next: () => {
            this.studentService.getStudentById(id).subscribe({
              next: (student: any) => {

                const resumeUrl = student.resumeUrl || fileName;

                this.profile = {
                  ...this.profile,
                  ...student,
                  resumeUrl,
                };

                this.selectedResume = null;

                const user = JSON.parse(sessionStorage.getItem('user') || '{}');

                user.profile = {
                  ...user.profile,
                  resumeUrl,
                };

                sessionStorage.setItem('user', JSON.stringify(user));

                Swal.fire({
                  icon: 'success',
                  title: 'Hoja de vida actualizada',
                  timer: 1500,
                  showConfirmButton: false,
                  customClass: {
                    popup: 'konekt-swal',
                  },
                });
              },
              error: (err) => {
                console.error('GET STUDENT ERROR', err);
              },
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error actualizando hoja de vida',
              text: err?.message || 'Error inesperado',
              customClass: {
                popup: 'konekt-swal',
              },
            });
          },
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error subiendo archivo',
          text: err?.message || 'Error inesperado',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  });
}
  // =========================
  // EXISTENTE (SIN TOCAR)
  // =========================

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
    if (this.editForm.invalid) return;

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
    if (this.passwordForm.invalid) return;

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
          request$ = this.studentService.updateStudent(this.profile.id, payload);
          break;
        case 'company':
          request$ = this.companyService.updateCompany(this.profile.id, payload);
          break;
        case 'university':
          request$ = this.universityService.updateUniversity(this.profile.id, payload);
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