import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  constructor(
    private router: Router,
    private loginService: LoginService,
  ) {}
  email: string = '';

  sendRecovery(): void {
    if (!this.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Correo requerido',
        text: 'Debes ingresar un correo electrónico',
        confirmButtonColor: '#2563eb',
        customClass: {
          popup: 'konekt-swal',
        },
      });

      return;
    }

    Swal.fire({
      title: 'Enviando...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: 'konekt-swal',
      },
    });

    this.loginService.forgotPassword(this.email.trim()).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Revisa tu correo para continuar con la recuperación de contraseña',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },

      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.message || 'No se pudo enviar el correo de recuperación',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }
  goToLogin() {
    this.router.navigate(['/']);
  }
}
