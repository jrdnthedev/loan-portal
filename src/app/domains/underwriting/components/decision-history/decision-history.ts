import { Component, inject } from '@angular/core';
import { UnderwritingStore } from '../../store/underwriting-store';

@Component({
  selector: 'app-decision-history',
  imports: [],
  templateUrl: './decision-history.html',
  styleUrl: './decision-history.scss',
})
export class DecisionHistory {
  private store = inject(UnderwritingStore);

  readonly loading$ = this.store.loading$;
  readonly state$ = this.store.state$;

  constructor() {}
}
