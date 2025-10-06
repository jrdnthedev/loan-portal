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

  handleBack() {
    console.log('back clicked!');
  }

  handleNext() {
    console.log('next clicked!');
  }

  handleSubmit() {
    console.log('submit clicked!');
  }
}
