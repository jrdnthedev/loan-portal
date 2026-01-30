import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingStencil } from './loading-stencil';

describe('LoadingStencil', () => {
  let component: LoadingStencil;
  let fixture: ComponentFixture<LoadingStencil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingStencil],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingStencil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
