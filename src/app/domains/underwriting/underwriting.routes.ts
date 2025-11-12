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
];
