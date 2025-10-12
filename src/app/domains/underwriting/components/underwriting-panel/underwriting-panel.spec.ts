import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderwritingPanel } from './underwriting-panel';

describe('UnderwritingPanel', () => {
  let component: UnderwritingPanel;
  let fixture: ComponentFixture<UnderwritingPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderwritingPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(UnderwritingPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
