import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-student-register',
  imports: [FormsModule],
  templateUrl: './student-register.component.html',
  styleUrl: './student-register.component.css',
})
export class StudentRegisterComponent {
  showPassword = false;
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/']);
  }
}
