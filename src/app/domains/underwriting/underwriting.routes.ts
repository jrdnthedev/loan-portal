import { Routes } from '@angular/router';

export const UNDERWRITING_ROUTES: Routes = [
  {
    path: 'loan_decision',
    loadComponent: () =>
      import('./components/loan-decision/loan-decision').then((m) => m.LoanDecision),
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
    children: [],
  },
];
