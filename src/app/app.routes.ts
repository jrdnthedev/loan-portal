import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () => import('./layout/components/welcome/welcome').then((m) => m.Welcome),
    title: 'Welcome',
  },
  {
    path: 'shell',
    loadComponent: () => import('./layout/components/shell/shell').then((m) => m.Shell),
    canActivate: [AuthGuard],
    title: 'Layout',
  },
  {
    path: 'loan-application',
    loadChildren: () =>
      import('./domains/loan-application/loan-application.routes').then(
        (m) => m.LOAN_APPLICATION_ROUTES,
      ),
    canActivate: [AuthGuard],
    title: 'Loan Application',
  },
  {
    path: 'underwriting',
    loadChildren: () =>
      import('./domains/underwriting/underwriting.routes').then((m) => m.UNDERWRITING_ROUTES),
    canActivate: [AuthGuard],
    title: 'Underwriting Routes',
  },
  {
    path: 'admin',
    loadChildren: () => import('./domains/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [AuthGuard],
    title: 'Admin Routes',
  },
];
