import { Component } from '@angular/core';
import { LoanDetails } from '../loan-details/loan-details';
import { DecisionHistory } from '../decision-history/decision-history';

@Component({
  selector: 'app-underwriting-panel',
  imports: [LoanDetails, DecisionHistory],
  templateUrl: './underwriting-panel.html',
  styleUrl: './underwriting-panel.scss',
})
export class UnderwritingPanel {}
