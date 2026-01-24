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
    it('should display custom button text', () => {
      component.buttonText = 'Custom Text';
      fixture.detectChanges();

      expect(buttonElement.textContent?.trim()).toBe('Custom Text');
    });

    it('should set button type to submit', () => {
      component.type = 'submit';
      fixture.detectChanges();

      expect(buttonElement.type).toBe('submit');
    });

    it('should set button type to reset', () => {
      component.type = 'reset';
      fixture.detectChanges();

      expect(buttonElement.type).toBe('reset');
    });

    it('should default to button type', () => {
      expect(buttonElement.type).toBe('button');
    });
  });

  describe('Click Handling', () => {
    it('should call handleClick when button is clicked', () => {
      spyOn(component, 'handleClick');

      buttonElement.click();

      expect(component.handleClick).toHaveBeenCalled();
    });

    it('should emit clicked event after throttle time', fakeAsync(() => {
      spyOn(component.clicked, 'emit');

      component.handleClick();
      tick(2000);

      expect(component.clicked.emit).toHaveBeenCalled();
    }));

    it('should throttle multiple rapid clicks', fakeAsync(() => {
      spyOn(component.clicked, 'emit');

      // Rapidly click multiple times
      component.handleClick();
      component.handleClick();
      component.handleClick();

      tick(1000); // Less than throttle time
      expect(component.clicked.emit).not.toHaveBeenCalled();

      tick(1000); // Complete throttle time
      expect(component.clicked.emit).toHaveBeenCalledTimes(1);
    }));

    it('should allow clicks after throttle period', fakeAsync(() => {
      spyOn(component.clicked, 'emit');

      // First click
      component.handleClick();
      tick(2000);
      expect(component.clicked.emit).toHaveBeenCalledTimes(1);

      // Second click after throttle period
      component.handleClick();
      tick(2000);
      expect(component.clicked.emit).toHaveBeenCalledTimes(2);
    }));
  });

  describe('DOM Integration', () => {
    it('should render button with correct attributes', () => {
      component.buttonText = 'Test Button';
      component.type = 'submit';
      fixture.detectChanges();

      expect(buttonElement.textContent?.trim()).toBe('Test Button');
      expect(buttonElement.type).toBe('submit');
    });

    it('should trigger click event when button is clicked', () => {
      spyOn(component, 'handleClick');

      const event = new Event('click');
      buttonElement.dispatchEvent(event);

      expect(component.handleClick).toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize throttle subscription on ngOnInit', () => {
      spyOn(component.clicked, 'emit');

      // Component already initialized in beforeEach
      component.handleClick();

      expect(component.clicked.emit).not.toHaveBeenCalled(); // Should be throttled
    });
  });
});
