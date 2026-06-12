import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-panel',
  imports: [],
  templateUrl: './role-panel.component.html',
  styleUrl: './role-panel.component.css',
})
export class RolePanelComponent {
  constructor(private router: Router) {}

  goToStudentRegister() {
    this.router.navigate(['/register/student']);
  }

  goToCompanyRegister() {
    this.router.navigate(['/register/company']);
  }

  goToUniversityRegister() {
    this.router.navigate(['/register/university']);
  }
    goToRoles(): void {
    this.router.navigate(['/']);
  }
}
