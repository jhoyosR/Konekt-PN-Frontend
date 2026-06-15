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
//Metodo para ir al registro de estudiante
  goToStudentRegister() {
    this.router.navigate(['/register/student']);
  }
//Metodo para ir al registro de empresa
  goToCompanyRegister() {
    this.router.navigate(['/register/company']);
  }
//Metodo para ir al registro de universidad
  goToUniversityRegister() {
    this.router.navigate(['/register/university']);
  }
  //Metodo para volver login
    goToLogin(): void {
    this.router.navigate(['/']);
  }
}
