import { Routes } from '@angular/router';

export const UNDERWRITING_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'panel',
    pathMatch: 'full',
  },
  {
    path: 'panel',
    loadComponent: () =>
      import('./components/underwriting-panel/underwriting-panel').then((m) => m.UnderwritingPanel),
    title: 'Underwriting Panel',
  },
  {
    path: 'loan-details',
    loadComponent: () =>
      import('./components/loan-details/loan-details').then((m) => m.LoanDetails),
    title: 'Loan Details',
  },
  {
    path: 'decision-history',
    loadComponent: () =>
      import('./components/decision-history/decision-history').then((m) => m.DecisionHistory),
    title: 'Decision History',
  },
];
