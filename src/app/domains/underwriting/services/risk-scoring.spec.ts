import { TestBed } from '@angular/core/testing';

import { RiskScoring } from './risk-scoring';

describe('RiskScoring', () => {
  let service: RiskScoring;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskScoring);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
