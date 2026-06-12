import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ProfileField {
  label: string;
  key: string;
  fullWidth?: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: any = {};
  profile: any = {};
  fields: ProfileField[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const sessionUser = JSON.parse(sessionStorage.getItem('user') || '{}');

    this.user = sessionUser;
    this.profile = sessionUser.profile || {};

    // Campo auxiliar para mostrar el nombre de la universidad
    if (this.profile.university) {
      this.profile.universityName = this.profile.university.name;
    }

    this.loadFields();
  }

  private loadFields(): void {
    switch (this.user.role) {
      case 'company':
        this.fields = [
          { label: 'Nombre', key: 'name' },
          { label: 'NIT', key: 'nit' },
          { label: 'Industria', key: 'industry' },
          { label: 'Teléfono', key: 'phone' },
          { label: 'Dirección', key: 'address', fullWidth: true },
          { label: 'Descripción', key: 'description', fullWidth: true },
        ];
        break;

      case 'student':
        this.fields = [
          { label: 'Nombre completo', key: 'fullName' },
          { label: 'Documento', key: 'documentNumber' },
          { label: 'Teléfono', key: 'phone' },
          { label: 'Carrera', key: 'career' },
          { label: 'Semestre', key: 'semester' },
          { label: 'Universidad', key: 'universityName' },
          { label: 'Acerca de mí', key: 'about', fullWidth: true },
        ];
        break;

      case 'university':
        this.fields = [
          { label: 'Nombre', key: 'name' },
          { label: 'NIT', key: 'nit' },
          { label: 'Teléfono', key: 'phone' },
          { label: 'Dirección', key: 'address' },
        ];
        break;

      default:
        this.fields = [];
        break;
    }
  }

  goToDashboard(): void {
    switch (this.user.role) {
      case 'student':
        this.router.navigate(['/dashboard/student']);
        break;

      case 'company':
        this.router.navigate(['/dashboard/company']);
        break;

      case 'university':
        this.router.navigate(['/dashboard/university']);
        break;

      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
