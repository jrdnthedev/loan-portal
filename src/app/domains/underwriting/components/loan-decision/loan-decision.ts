import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Topbar } from '../../../../shared/components/topbar/topbar';
import { UnderwritingStore } from '../../store/underwriting-store';
import { Card } from '../../../../shared/components/card/card';
import { Button } from '../../../../shared/components/button/button';
import { CurrencyPipe } from '@angular/common';
import { Badge } from '../../../../shared/components/badge/badge';
import { FormInput } from '../../../../shared/components/form-input/form-input';

@Component({
  selector: 'app-loan-decision',
  imports: [Topbar, Card, Button, CurrencyPipe, Badge, FormInput],
  templateUrl: './loan-decision.html',
  styleUrl: './loan-decision.scss',
})
export class LoanDecision {
  private store = inject(UnderwritingStore);
  private router = inject(Router);

  readonly selectedLoans = this.store.selectedLoans;

  readonly currentLoan = computed(() => this.selectedLoans()[0]);

  readonly riskProfile = computed(() => {
    const loan = this.currentLoan();
    return loan ? this.store.evaluateLoanRisk(loan) : null;
  });

  constructor() {
    if (!this.selectedLoans().length) {
      this.router.navigate(['/underwriting/review_queue']);
    }
    console.log(this.store.evaluateLoanRisk(this.currentLoan()));
  }
}
