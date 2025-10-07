import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanWizard } from './loan-wizard';

describe('LoanWizard', () => {
  let component: LoanWizard;
  let fixture: ComponentFixture<LoanWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanWizard],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
