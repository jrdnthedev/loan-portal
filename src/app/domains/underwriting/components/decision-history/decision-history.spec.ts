import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionHistory } from './decision-history';

describe('DecisionHistory', () => {
  let component: DecisionHistory;
  let fixture: ComponentFixture<DecisionHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(DecisionHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
