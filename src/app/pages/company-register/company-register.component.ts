import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-register',
  imports: [FormsModule],
  templateUrl: './company-register.component.html',
  styleUrl: './company-register.component.css',
})
export class CompanyRegisterComponent {
  showPassword = false;
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/']);
  }
}
