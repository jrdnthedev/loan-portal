import { Component, effect, inject } from '@angular/core';
import { UnderwritingStore } from '../../store/underwriting-store';
import { Card } from '../../../../shared/components/card/card';

@Component({
  selector: 'app-loan-details',
  imports: [Card],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.scss',
})
export class LoanDetails {
  private store = inject(UnderwritingStore);
  readonly loading = this.store.loading;
  readonly state = this.store.state;
  readonly loanQueue = this.store.queue;

  constructor() {
    // Effect runs whenever loanQueue signal changes
    effect(() => {
      console.log('Loan queue updated:', this.loanQueue());
    });
  }
}
