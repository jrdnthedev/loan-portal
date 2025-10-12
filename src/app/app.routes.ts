import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/loan-application',
    pathMatch: 'full',
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
