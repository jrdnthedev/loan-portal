import { Component, inject, signal } from '@angular/core';
import { LoanType } from '../../models/loan-type';
import { Loan } from '../../models/loan';
import { LoanForm } from '../loan-form/loan-form';
import { LoanApplicationStore } from '../../store/loan-application.store';

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

  private store = inject(LoanApplicationStore);

  // Expose store observables for the template
  readonly currentLoan$ = this.store.currentLoan$;
  readonly isSubmitting$ = this.store.isSubmitting$;
  readonly error$ = this.store.error$;
  readonly isLoading$ = this.store.isLoading$;

  onFormSubmitted(loan: Loan) {
    console.log('Submitting loan:', loan);
    this.store.updateCurrentLoan(loan);
    this.store.submitLoanApplication();
  }

  onFormSaved(draft: Partial<Loan>) {
    console.log('Draft saved:', draft);
    this.store.updateCurrentLoan(draft);
    this.store.saveCurrentLoanDraft();
    this.savedDraft = draft;
  }
}
