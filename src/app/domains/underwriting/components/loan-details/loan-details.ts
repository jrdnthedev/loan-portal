import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UnderwritingStore } from '../../store/underwriting-store';

@Component({
  selector: 'app-loan-details',
  imports: [AsyncPipe],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.scss',
})
export class LoanDetails {
  private store = inject(UnderwritingStore);
  readonly loading$ = this.store.loading$;
  readonly state$ = this.store.state$;

  ngOnInit() {
    this.store.loadSubmittedLoans();
    this.loading$.subscribe((data) => console.log('loading', data));
    this.state$.subscribe((data) => console.log('hello state', data));
  }
}
