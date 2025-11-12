import { Routes } from '@angular/router';
import { AuthContainer } from './components/auth-container/auth-container';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthContainer,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
];
