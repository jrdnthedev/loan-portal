import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureToggle } from './feature-toggle';

describe('FeatureToggle', () => {
  let component: FeatureToggle;
  let fixture: ComponentFixture<FeatureToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
