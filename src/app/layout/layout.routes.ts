import { Routes } from '@angular/router';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'shell',
    pathMatch: 'full',
  },
  {
    path: 'shell',
    loadComponent: () => import('./components/shell/shell').then((m) => m.Shell),
    title: 'Application Shell',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard',
  },
  {
    path: 'nav',
    loadComponent: () => import('./components/nav/nav').then((m) => m.Nav),
    title: 'Navigation Bar',
  },
  {
    path: 'sidepanel',
    loadComponent: () => import('./components/sidepanel/sidepanel').then((m) => m.Sidepanel),
    title: 'Side Panel',
  },
];
