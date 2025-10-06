import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSummary } from './loan-summary';

describe('LoanSummary', () => {
  let component: LoanSummary;
  let fixture: ComponentFixture<LoanSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
