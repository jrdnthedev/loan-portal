import { Component } from '@angular/core';
import { Card } from '../../../shared/components/card/card';
import { PendingApplication } from '../../../domains/loan-application/components/pending-application/pending-application';

@Component({
  selector: 'app-dashboard',
  imports: [Card, PendingApplication],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
