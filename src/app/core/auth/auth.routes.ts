import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'auth-container',
    pathMatch: 'full',
  },
  {
    path: 'auth-container',
    loadComponent: () =>
      import('./components/auth-container/auth-container').then((m) => m.AuthContainer),
    title: 'Auth Container',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/login/login').then((m) => m.Login),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register').then((m) => m.Register),
      },
    ],
  },
];
