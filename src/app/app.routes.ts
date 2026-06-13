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
import { UniversityStudentsComponent } from './pages/university-students/university-students.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminStudentsComponent } from './pages/admin-students/admin-students.component';
import { AdminUniversitiesComponent } from './pages/admin-universities/admin-universities.component';
import { AdminCompaniesComponent } from './pages/admin-companies/admin-companies.component';
import { AdminApplicationsComponent } from './pages/admin-applications/admin-applications.component';
import { AdminVacanciesComponent } from './pages/admin-vacancies/admin-vacancies.component';
import { AdminPartnershipComponent } from './pages/admin-partnership/admin-partnership.component';
import { UniversityPartnershipComponent } from './pages/university-partnership/university-partnership.component';
import { CompanyPartnershipComponent } from './pages/company-partnership/company-partnership.component';

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
        path: 'admin',
        component: AdminDashboardComponent,
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
             {
            path: 'partnership',
            component: CompanyPartnershipComponent,
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
        path: 'university',
        children: [
          {
            path: '',
            component: UniversityDashboardComponent,
          },
          {
            path: 'students',
            component: UniversityStudentsComponent,
          },
           {
            path: 'partnership',
            component: UniversityPartnershipComponent,
          },
        ],
      },
      {
        path: 'admin',
        children: [
          {
            path: '',
            component: AdminDashboardComponent,
          },
          {
            path: 'users',
            component: AdminUsersComponent,
          },
          {
            path: 'students',
            component: AdminStudentsComponent,
          },
          {
            path: 'university',
            component: AdminUniversitiesComponent,
          },
          {
            path: 'company',
            component: AdminCompaniesComponent,
          },
          {
            path: 'applications',
            component: AdminApplicationsComponent,
          },
          {
            path: 'vacancies',
            component: AdminVacanciesComponent,
          },
          {
            path: 'partnership',
            component: AdminPartnershipComponent,
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
