import { Component } from '@angular/core';
import {
  ChildNavLayout,
  NavItem,
} from '../../../../shared/components/child-nav-layout/child-nav-layout';

@Component({
  selector: 'app-admin-console',
  imports: [ChildNavLayout],
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
