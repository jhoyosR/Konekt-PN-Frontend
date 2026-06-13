import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnChanges {
  @Input() role: 'student' | 'company' | 'university' | 'super-admin' =
    'student';
  menuOpen = false;

  links: { label: string; path: string }[] = [];

  constructor(private router: Router) {}

  ngOnChanges(): void {
    this.setLinks();
  }

  private setLinks(): void {
    switch (this.role) {
      case 'company':
        this.links = [
          { label: 'Inicio', path: '/dashboard/company' },
          { label: 'Vacantes', path: '/dashboard/company/vacancies' },
          { label: 'Postulaciones', path: '/dashboard/company/applications' },
          { label: 'Convenios', path: '/dashboard/company/partnership' },
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
