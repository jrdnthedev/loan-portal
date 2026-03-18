import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDecision } from './loan-decision';

describe('LoanDecision', () => {
  let component: LoanDecision;
  let fixture: ComponentFixture<LoanDecision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDecision],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDecision);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
