import { Component } from '@angular/core';

interface NavItem {
  label: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-admin-console',
  imports: [],
  templateUrl: './admin-console.html',
  styleUrl: './admin-console.scss',
})
export class AdminConsole {
  navItems: NavItem[] = [
    {
      label: 'Audit',
      route: 'audit_log',
      description: 'View system audit logs and activity history',
    },
    {
      label: 'User Management',
      route: 'user_management',
      description: 'Manage user accounts and permissions',
    },
    // {
    //   label: 'Feature Toggle',
    //   route: 'feature_toggle',
    //   description: 'Enable or disable application features'
    // },
  ];
}
