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
    children: [
      {
        path: 'loan_details',
        loadComponent: () =>
          import('./components/loan-details/loan-details').then((m) => m.LoanDetails),
      },
      {
        path: 'decision_history',
        loadComponent: () =>
          import('./components/decision-history/decision-history').then((m) => m.DecisionHistory),
      },
      {
        path: 'review_queue',
        loadComponent: () =>
          import('./components/review-queue/review-queue').then((m) => m.ReviewQueue),
      },
    ],
  },
];
