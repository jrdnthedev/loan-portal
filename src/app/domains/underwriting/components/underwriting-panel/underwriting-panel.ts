import { Component } from '@angular/core';
import {
  ChildNavLayout,
  NavItem,
} from '../../../../shared/components/child-nav-layout/child-nav-layout';

@Component({
  selector: 'app-underwriting-panel',
  imports: [ChildNavLayout],
  templateUrl: './underwriting-panel.html',
  styleUrl: './underwriting-panel.scss',
})
export class UnderwritingPanel {
  navItems: NavItem[] = [
    {
      label: 'Review Queue',
      route: 'review_queue',
      description: 'Manage user accounts and permissions',
    },
    {
      label: 'Loan Details',
      route: 'loan_details',
      description: 'View system audit logs and activity history',
    },
    {
      label: 'Decision History',
      route: 'decision_history',
      description: 'Manage user accounts and permissions',
    },
  ];
}
