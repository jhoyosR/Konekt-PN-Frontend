import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
constructor(private router: Router) {}
  ngOnInit(): void {
    const sessionUser = JSON.parse(
      sessionStorage.getItem('user') || '{}',
    );

    this.user = sessionUser;
    this.profile = sessionUser.profile || {};
  }
  goToDashboard(): void {
  const user = JSON.parse(
    sessionStorage.getItem('user') || '{}',
  );

  switch (user.role) {
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