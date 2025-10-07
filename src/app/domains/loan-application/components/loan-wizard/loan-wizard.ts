import { Component, signal } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { LoanType } from '../../models/loan-type';
import { Loan } from '../../models/loan';
import { LoanForm } from '../loan-form/loan-form';

@Component({
  selector: 'app-loan-wizard',
  imports: [LoanForm],
  templateUrl: './loan-wizard.html',
  styleUrl: './loan-wizard.scss',
})
export class LoanWizard {
  protected readonly main_header = signal('Loan Application Wizard');
  selectedLoanType: LoanType = LoanType.Auto;
  loanTypes = LoanType;
  submittedLoan?: Loan;
  savedDraft?: Partial<Loan>;

  onFormSubmitted(loan: Loan) {
    console.log('Loan application submitted:', loan);
    this.submittedLoan = loan;
  }

  onFormSaved(draft: Partial<Loan>) {
    console.log('Draft saved:', draft);
    this.savedDraft = draft;
  }
}
