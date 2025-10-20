import { Component } from '@angular/core';
import { Card } from '../../../shared/components/card/card';
import { PendingApplication } from '../../../domains/loan-application/components/pending-application/pending-application';
import { LoanOfficer } from '../../../domains/loan-application/components/loan-officer/loan-officer';

@Component({
  selector: 'app-dashboard',
  imports: [Card, PendingApplication, LoanOfficer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
