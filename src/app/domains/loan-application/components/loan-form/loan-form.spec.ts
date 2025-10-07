import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanForm } from './loan-form';

describe('LoadForm', () => {
  let component: LoanForm;
  let fixture: ComponentFixture<LoanForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
