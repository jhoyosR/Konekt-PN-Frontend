import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-university-register',
  imports: [FormsModule],
  templateUrl: './university-register.component.html',
  styleUrl: './university-register.component.css',
})
export class UniversityRegisterComponent {
  showPassword = false;
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/']);
  }
}
