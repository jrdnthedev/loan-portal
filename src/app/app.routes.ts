import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/layout',
    pathMatch: 'full',
  },
  {
    path: 'layout',
    loadChildren: () => import('./layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
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
];
