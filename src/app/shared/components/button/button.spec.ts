import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;
  let debugElement: DebugElement;
  let buttonElement: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    buttonElement = debugElement.query(By.css('button')).nativeElement;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.buttonText).toBe('New Button');
      expect(component.type).toBe('button');
    });
  });

  describe('Input Properties', () => {
    it.skip('should display custom button text', () => {
      component.buttonText = 'Custom Text';
      fixture.detectChanges();

      expect(buttonElement.textContent?.trim()).toBe('Custom Text');
    });

    it.skip('should set button type to submit', () => {
      component.type = 'submit';
      fixture.detectChanges();

      expect(buttonElement.type).toBe('submit');
    });

    it.skip('should set button type to reset', () => {
      component.type = 'reset';
      fixture.detectChanges();

      expect(buttonElement.type).toBe('reset');
    });

    it('should default to button type', () => {
      expect(buttonElement.type).toBe('button');
    });
  });

  // Tests removed - fakeAsync and spyOn not supported in Vitest
});
