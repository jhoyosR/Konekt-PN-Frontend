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

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },

  {
    path: 'roles',
    component: RolePanelComponent
  },

  {
    path: 'register',
    children: [
      {
        path: 'student',
        component: StudentRegisterComponent
      },
      {
        path: 'university',
        component: UniversityRegisterComponent
      },
      {
        path: 'company',
        component: CompanyRegisterComponent
      },
      {
        path: '',
        redirectTo: 'student',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: 'dashboard',
    children: [
      {
        path: 'student',
        component: StudentDashboardComponent
      },
      {
        path: 'university',
        component: UniversityDashboardComponent
      },
      {
        path: 'company',
        component: CompanyDashboardComponent
      },
      {
        path: '',
        redirectTo: 'student',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent
  }
];