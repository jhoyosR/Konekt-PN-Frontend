import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RolePanelComponent } from './pages/role-panel/role-panel.component';

import { StudentRegisterComponent } from './pages/student-register/student-register.component';
import { UniversityRegisterComponent } from './pages/university-register/university-register.component';
import { CompanyRegisterComponent } from './pages/company-register/company-register.component';

import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { UniversityDashboardComponent } from './pages/university-dashboard/university-dashboard.component';
import { CompanyDashboardComponent } from './pages/company-dashboard/company-dashboard.component';

import { CompanyVacanciesComponent } from './pages/company-vacancies/company-vacancies.component';
import { StudentVacanciesComponent } from './pages/student-vacancies/student-vacancies.component';
import { StudentApplicationComponent } from './pages/student-application/student-application.component';
import { CompanyApplicationComponent } from './pages/company-application/company-application.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },

  {
    path: 'roles',
    component: RolePanelComponent,
  },
 {
    path: 'profile',
    component: ProfileComponent,
  },

  {
    path: 'register',
    children: [
      {
        path: 'student',
        component: StudentRegisterComponent,
      },
      {
        path: 'university',
        component: UniversityRegisterComponent,
      },
      {
        path: 'company',
        component: CompanyRegisterComponent,
      },
      {
        path: '',
        redirectTo: 'student',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'dashboard',
    children: [
      {
        path: 'student',
        component: StudentDashboardComponent,
      },
      {
        path: 'university',
        component: UniversityDashboardComponent,
      },

      {
        path: 'company',
        children: [
          {
            path: '',
            component: CompanyDashboardComponent,
          },
          {
            path: 'vacancies',
            component: CompanyVacanciesComponent,
          },
          {
            path: 'applications',
            component: CompanyApplicationComponent,
          },
        ],
      },

      {
        path: 'student',
        children: [
          {
            path: '',
            component: StudentDashboardComponent,
          },
          {
            path: 'vacancies',
            component: StudentVacanciesComponent,
          },
          {
            path: 'applications',
            component: StudentApplicationComponent,
          },
        ],
      },

      {
        path: '',
        redirectTo: 'student',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
];
