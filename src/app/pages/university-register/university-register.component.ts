import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UniversityRegisterService } from '../../services/university-register.service';
import { UniversityRegisterRequest } from '../../interfaces/university-register-request';

@Component({
  selector: 'app-university-register',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './university-register.component.html',
  styleUrl: './university-register.component.css',
})
export class UniversityRegisterComponent {
  showPassword = false;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private universityRegisterService: UniversityRegisterService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required]],
        nit: ['', [Validators.required]],
        address: ['', [Validators.required]],
        phone: ['', [Validators.required]],

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

        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }
  //Metodo para validar que las contraseñas coincidan
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
  //Metodo para crear una universidad
  Universityregister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const data: UniversityRegisterRequest = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      name: this.registerForm.value.name,
      nit: this.registerForm.value.nit,
      address: this.registerForm.value.address,
      phone: this.registerForm.value.phone,
    };

    Swal.fire({
      title: 'Registrando universidad...',
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

    this.universityRegisterService.register(data).subscribe({
      next: (response) => {
        console.log('Register success', response);

        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'La universidad fue creada correctamente.',
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
            'No se pudo registrar la universidad.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }
  //Checkbox para mostrar y ocultar las contraseñas escritas
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordType(): string {
    return this.showPassword ? 'text' : 'password';
  }

  get f() {
    return this.registerForm.controls;
  }
  //Metodo para volver al login
  goToLogin(): void {
    this.router.navigate(['/']);
  }
  //Metodo para ir al panel de roles de registro
  goToRoles(): void {
    this.router.navigate(['/roles']);
  }
}
