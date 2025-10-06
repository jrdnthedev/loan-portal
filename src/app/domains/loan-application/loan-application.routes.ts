import { Routes } from '@angular/router';

export const LOAN_APPLICATION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'wizard',
    pathMatch: 'full',
  },
  {
    path: 'wizard',
    loadComponent: () => import('./components/loan-wizard/loan-wizard').then((m) => m.LoanWizard),
    title: 'Loan Application Wizard',
  },
  {
    path: 'summary',
    loadComponent: () =>
      import('./components/loan-summary/loan-summary').then((m) => m.LoanSummary),
    title: 'Loan Summary',
  },
];
