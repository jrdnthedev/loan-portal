import { Component, inject } from '@angular/core';
import { LoanApplicationStore } from '../../store/loan-application.store';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-pending-application',
  imports: [CommonModule],
  templateUrl: './pending-application.html',
  styleUrl: './pending-application.scss',
})
export class PendingApplication {
  private readonly store$ = inject(LoanApplicationStore);
  userLoans$ = this.store$.userLoans$.pipe(
    map((loans) => loans.slice(loans.length - 3, loans.length)),
  );
}
