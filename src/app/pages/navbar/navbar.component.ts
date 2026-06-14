import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnChanges, OnInit {
  @Input() role: 'student' | 'company' | 'university' | 'super-admin' =
    'student';

  menuOpen = false;

  profilePhotoUrl: string | null = null;

  links: { label: string; path: string }[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProfilePhoto();
  }

  ngOnChanges(): void {
    this.setLinks();
    this.loadProfilePhoto();
  }

  private loadProfilePhoto(): void {
    const userStr = sessionStorage.getItem('user');

    if (!userStr) {
      this.profilePhotoUrl = null;
      return;
    }

    try {
      const user = JSON.parse(userStr);

      this.profilePhotoUrl = user?.profile?.profilePhotoUrl || null;
    } catch {
      this.profilePhotoUrl = null;
    }
  }

  private setLinks(): void {
    switch (this.role) {
      case 'company':
        this.links = [
          { label: 'Inicio', path: '/dashboard/company' },
          { label: 'Vacantes', path: '/dashboard/company/vacancies' },
          { label: 'Postulaciones', path: '/dashboard/company/applications' },
          { label: 'Convenios', path: '/dashboard/company/partnership' },
          { label: 'Prácticas', path: '/dashboard/company/internship' },
          {
            label: 'Segumiento prácticas',
            path: '/dashboard/company/internship-update',
          },
        ];
        break;

      case 'university':
        this.links = [
          { label: 'Inicio', path: '/dashboard/university' },
          { label: 'Estudiantes', path: '/dashboard/university/students' },
          { label: 'Convenios', path: '/dashboard/university/partnership' },
        ];
        break;

      case 'super-admin':
        this.links = [
          { label: 'Inicio', path: '/dashboard/admin' },
          { label: 'Usuarios', path: '/dashboard/admin/users' },
          { label: 'Estudiantes', path: '/dashboard/admin/students' },
          { label: 'Empresas', path: '/dashboard/admin/company' },
          { label: 'Universidades', path: '/dashboard/admin/university' },
          { label: 'Vacantes', path: '/dashboard/admin/vacancies' },
          { label: 'Postulaciones', path: '/dashboard/admin/applications' },
          { label: 'Convenios', path: '/dashboard/admin/partnership' },
        ];
        break;

      default:
        this.links = [
          { label: 'Inicio', path: '/dashboard/student' },
          { label: 'Vacantes', path: '/dashboard/student/vacancies' },
          {
            label: 'Mis postulaciones',
            path: '/dashboard/student/applications',
          },
          {
            label: 'Mi práctica',
            path: '/dashboard/student/internship',
          },
        ];
    }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goToProfile(): void {
    this.menuOpen = false;
    this.router.navigate(['/profile']);
  }
}
