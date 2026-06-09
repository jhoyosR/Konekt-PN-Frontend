import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  email: string = 'usuario@correo.com';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {}

  resetPassword() {
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Password actualizada:', this.password);
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}