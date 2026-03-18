import { Component, Input } from '@angular/core';
import { Card } from '../../../../shared/components/card/card';
import { Loan } from '../../../loan-application/models/loan';

@Component({
  selector: 'app-loan-details',
  imports: [Card],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.scss',
})
export class LoanDetails {
  @Input() loan!: Loan;
}
