import { TestBed } from '@angular/core/testing';

import { Audit } from './audit-service';

describe('Audit', () => {
  let service: Audit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Audit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
