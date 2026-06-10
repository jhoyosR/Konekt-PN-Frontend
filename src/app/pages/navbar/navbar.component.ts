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

  links: { label: string; path: string }[] = [];

  constructor(private router: Router) {}

  ngOnChanges(): void {
    this.setLinks();
  }

  private setLinks(): void {
    switch (this.role) {
      case 'company':
        this.links = [
          { label: 'Vacantes', path: '/company/vacancies' },
        ];
        break;

      case 'university':
        this.links = [
          { label: 'Dashboard', path: '/university/dashboard' },
          { label: 'Estudiantes', path: '/university/students' },
        ];
        break;

      default:
        this.links = [
          { label: 'Dashboard', path: '/student/dashboard' },
          { label: 'Vacantes', path: '/student/jobs' },
        ];
    }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
 
}
