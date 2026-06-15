import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  showPassword = false;
  token = '';
  passwordForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.token =
      this.route.snapshot.queryParamMap.get('token') || '';

    this.passwordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
            ),
          ],
        ],
        confirmPassword: [
          '',
          Validators.required,
        ],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );

    if (!this.token) {
      Swal.fire({
        icon: 'error',
        title: 'Token inválido',
        text: 'No se encontró el token de recuperación',
        confirmButtonColor: '#2563eb',
        customClass: {
          popup: 'konekt-swal',
        },
      }).then(() => {
        this.router.navigate(['/']);
      });
    }
  }
//Metodo para validar que las contraseñas escritas coincidan
  passwordsMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword =
      control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  get passwordsDoNotMatch(): boolean {
    return (
      this.passwordForm.hasError('passwordMismatch') &&
      this.confirmPassword?.touched === true
    );
  }
//Metodo para restablecer contraseña
  resetPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const password = this.password?.value;

    Swal.fire({
      title: 'Actualizando contraseña...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'konekt-swal',
      },
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.loginService
      .resetPassword(this.token, password)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            text: 'Ya puedes iniciar sesión',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'konekt-swal',
            },
          }).then(() => {
            this.router.navigate(['/']);
          });
        },

        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error?.message ||
              'No fue posible actualizar la contraseña',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'konekt-swal',
            },
          });
        },
      });
  }
//Metodo para volver al login
  goToLogin(): void {
    this.router.navigate(['/']);
  }
}