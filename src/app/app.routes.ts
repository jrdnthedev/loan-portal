import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'shell',
    pathMatch: 'full',
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
