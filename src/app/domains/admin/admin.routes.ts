import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'admin_console',
    pathMatch: 'full',
  },
  {
    path: 'admin_console',
    loadComponent: () =>
      import('./components/admin-console/admin-console').then((m) => m.AdminConsole),
    title: 'Admin Console',
    children: [
      {
        path: 'audit_log',
        loadComponent: () => import('./components/audit-log/audit-log').then((m) => m.AuditLog),
      },
      {
        path: 'user_management',
        loadComponent: () =>
          import('./components/user-management/user-management').then((m) => m.UserManagement),
      },
    ],
  },
];
