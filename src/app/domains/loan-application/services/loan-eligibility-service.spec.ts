import { TestBed } from '@angular/core/testing';

import { LoanEligibilityService } from './loan-eligibility-service';

describe('LoanEligibilityService', () => {
  let service: LoanEligibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanEligibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
