import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingApplication } from './pending-application';

describe('PendingApplication', () => {
  let component: PendingApplication;
  let fixture: ComponentFixture<PendingApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApplication],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
