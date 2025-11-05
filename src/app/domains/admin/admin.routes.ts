import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'admin_console',
    pathMatch: 'full',
  },
  {
    path: 'audit_log',
    loadComponent: () => import('./components/audit-log/audit-log').then((m) => m.AuditLog),
    title: 'Audit Log',
  },
  {
    path: 'admin_console',
    loadComponent: () =>
      import('./components/admin-console/admin-console').then((m) => m.AdminConsole),
    title: 'Admin Console',
  },
  {
    path: 'user_management',
    loadComponent: () =>
      import('./components/user-management/user-management').then((m) => m.UserManagement),
    title: 'User Management',
  },
];
