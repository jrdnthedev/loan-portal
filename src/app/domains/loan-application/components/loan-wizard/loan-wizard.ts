import { Component, signal } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { LoanType } from '../../models/loan-type';
import { Loan } from '../../models/loan';
import { LoanForm } from '../loan-form/loan-form';

@Component({
  selector: 'app-loan-wizard',
  imports: [Button, LoanForm],
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
  selectedLoanType: LoanType = LoanType.Personal;
  loanTypes = LoanType;
  submittedLoan?: Loan;
  savedDraft?: Partial<Loan>;

  onLoanTypeChange(loanType: LoanType) {
    this.selectedLoanType = loanType;
    this.submittedLoan = undefined;
    this.savedDraft = undefined;
  }

  onFormSubmitted(loan: Loan) {
    console.log('Loan application submitted:', loan);
    this.submittedLoan = loan;
    // Here you would typically send the data to your API
  }

  onFormSaved(draft: Partial<Loan>) {
    console.log('Draft saved:', draft);
    this.savedDraft = draft;
    // Here you would typically save the draft to local storage or API
  }
}
