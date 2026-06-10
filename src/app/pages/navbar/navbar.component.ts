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
  @Input() role: 'student' | 'company' | 'university' = 'student';
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
          { label: 'Vacantes', path: '/dashboard/company/vacancies' },
          { label: 'Postulaciones', path: '/dashboard/company/applications' },
        ];
        break;

      case 'university':
        this.links = [
          { label: 'Estudiantes', path: '/dashboard/university/students' },
        ];
        break;

      default:
        this.links = [
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
