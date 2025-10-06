import { Component, signal } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-loan-wizard',
  imports: [Button],
  templateUrl: './loan-wizard.html',
  styleUrl: './loan-wizard.scss',
})
export class LoanWizard {
  protected readonly main_header = signal('Loan Application Wizard');

  onPreviousStep(): void {
    console.log('back clicked!');
  }

  onNextStep(): void {
    console.log('next clicked!');
  }

  submitLoanApplication(): void {
    console.log('submit clicked!');
  }
}
