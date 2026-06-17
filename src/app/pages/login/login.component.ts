import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../interfaces/login-request';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword = false;

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
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
    });
  }
  //Metodo para iniciar sesión
  signIn(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    Swal.fire({
      title: 'Iniciando sesión...',
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

    this.loginService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);

        const user =
          response?.user || JSON.parse(sessionStorage.getItem('user') || '{}');
        const role = user?.role;

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Inicio de sesión exitoso.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        }).then(() => {
          switch (role) {
            case 'student':
              this.router.navigate(['/dashboard/student']);
              break;

            case 'company':
              this.router.navigate(['/dashboard/company']);
              break;

            case 'university':
              this.router.navigate(['/dashboard/university']);
              break;
            case 'super-admin':
              this.router.navigate(['/dashboard/admin']);
              break;

            default:
              this.router.navigate(['/']);
              break;
          }
        });
      },

      error: (error) => {
        console.error('Login error', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.message || 'No se pudo iniciar sesión.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }
  //Checbox para mostrar y ocultar la contraseña
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get f() {
    return this.loginForm.controls;
  }
  //Metodo para ir al panel de roles de registro
  goToRegister(): void {
    this.router.navigate(['/roles']);
  }
  //Metodo para ir a "olvidé mi contraseña"
  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
