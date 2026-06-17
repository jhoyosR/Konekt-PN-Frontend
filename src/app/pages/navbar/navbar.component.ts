import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

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

  notificationsOpen = false;

  notifications: any[] = [];
  unreadCount = 0;
  constructor(private router: Router, private notificationService: NotificationService,) {}

ngOnInit(): void {
  this.loadProfilePhoto();
  this.loadNotifications();
  this.loadUnreadCount();
}

  ngOnChanges(): void {
    this.setLinks();
    this.loadProfilePhoto();
  }
  //Metodo para cargar la foto de perfil en el nav
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
  //Metodo para los links dependiendo del rol en el nav
  private setLinks(): void {
    switch (this.role) {
      case 'company':
        this.links = [
          { label: 'Inicio', path: '/dashboard/company' },
          { label: 'Vacantes', path: '/dashboard/company/vacancies' },
          { label: 'Postulaciones', path: '/dashboard/company/applications' },
          { label: 'Convenios', path: '/dashboard/company/partnership' },
          { label: 'Prácticas', path: '/dashboard/company/internship' },
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
          {
            label: 'Mis habilidades',
            path: '/dashboard/student/skill',
          },
        ];
    }
  }
  //Metodo para cerrar sesión
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
  //Metodo para desplegar el menú
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  //Metodo para ir al perfil
  goToProfile(): void {
    this.menuOpen = false;
    this.router.navigate(['/profile']);
  }

// Cargar notificaciones
loadNotifications(): void {
  this.notificationService.getNotifications().subscribe({
    next: (res) => {
      this.notifications = res;
    },
    error: (err) => {
      console.error('Error loading notifications', err);
    },
  });
}

// Cantidad de no leídas
loadUnreadCount(): void {
  this.notificationService.getUnreadCount().subscribe({
    next: (count) => {
      this.unreadCount = Number(count);
    },
    error: (err) => {
      console.error('Error loading unread count', err);
    },
  });
}

// Abrir menú
toggleNotifications(): void {
  this.notificationsOpen = !this.notificationsOpen;

  if (this.notificationsOpen) {
    this.menuOpen = false;
    this.loadNotifications();
    this.loadUnreadCount();
  }
}

// Marcar una como leída
markNotificationAsRead(id: number): void {
  this.notificationService.markAsRead(id).subscribe({
    next: () => {
      this.loadNotifications();
      this.loadUnreadCount();
    },
    error: (err) => {
      console.error('Error marking notification as read', err);
    },
  });
}

// Marcar todas
markAllNotificationsAsRead(): void {
  this.notificationService.markAllAsRead().subscribe({
    next: () => {
      this.loadNotifications();
      this.loadUnreadCount();
    },
    error: (err) => {
      console.error('Error marking all notifications as read', err);
    },
  });
}
}
