import { Routes } from '@angular/router';
import { AuthContainer } from './core/auth/components/auth-container/auth-container';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadChildren: () => import('./core/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    title: 'Welcome',
  },
  {
    path: 'shell',
    loadComponent: () => import('./layout/components/shell/shell').then((m) => m.Shell),
    title: 'Layout',
  },
  {
    path: 'loan-application',
    loadChildren: () =>
      import('./domains/loan-application/loan-application.routes').then(
        (m) => m.LOAN_APPLICATION_ROUTES,
      ),
    title: 'Loan Application',
  },
  {
    path: 'underwriting',
    loadChildren: () =>
      import('./domains/underwriting/underwriting.routes').then((m) => m.UNDERWRITING_ROUTES),
    title: 'Underwriting Routes',
  },
  {
    path: 'admin',
    loadChildren: () => import('./domains/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    title: 'Admin Routes',
  },
];
