import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  constructor(private router: Router) {}
  email: string = '';

  sendRecovery() {
    console.log(this.email);
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}
