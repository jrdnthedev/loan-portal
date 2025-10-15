import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidepanel } from './sidepanel';

describe('Sidepanel', () => {
  let component: Sidepanel;
  let fixture: ComponentFixture<Sidepanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidepanel],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidepanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
