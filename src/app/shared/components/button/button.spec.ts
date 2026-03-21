import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { axe } from 'vitest-axe';
import { Button, ButtonVariant } from './button';

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
    // Don't call detectChanges here to avoid ExpressionChangedAfterItHasBeenCheckedError
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.buttonText).toBe('New Button');
      expect(component.type).toBe('button');
      expect(component.variant).toBe('primary');
    });

    it('should render a button element', () => {
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement).toBeTruthy();
      expect(buttonElement.tagName.toLowerCase()).toBe('button');
    });
  });

  describe('Input Properties', () => {
    it('should display custom button text', () => {
      component.buttonText = 'Custom Text';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.textContent?.trim()).toBe('Custom Text');
    });

    it('should set button type to submit', () => {
      component.type = 'submit';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.type).toBe('submit');
    });

    it('should set button type to reset', () => {
      component.type = 'reset';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.type).toBe('reset');
    });

    it('should default to button type', () => {
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.type).toBe('button');
    });

    it('should accept buttonText input via setInput', () => {
      fixture.componentRef.setInput('buttonText', 'Via SetInput');
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(component.buttonText).toBe('Via SetInput');
      expect(buttonElement.textContent?.trim()).toBe('Via SetInput');
    });
  });

  describe('Button Variants', () => {
    const variants: ButtonVariant[] = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'ghost',
      'link',
    ];

    it('should apply primary variant class by default', () => {
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.classList.contains('primary')).toBe(true);
    });

    it('should apply secondary variant class', () => {
      component.variant = 'secondary';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.classList.contains('secondary')).toBe(true);
    });

    it('should apply success variant class', () => {
      component.variant = 'success';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.classList.contains('success')).toBe(true);
    });

    it('should apply danger variant class', () => {
      component.variant = 'danger';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.classList.contains('danger')).toBe(true);
    });

    it('should apply warning variant class', () => {
      component.variant = 'warning';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.classList.contains('warning')).toBe(true);
    });

    it('should apply info variant class', () => {
      component.variant = 'info';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.classList.contains('info')).toBe(true);
    });

    it('should apply ghost variant class', () => {
      component.variant = 'ghost';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.classList.contains('ghost')).toBe(true);
    });

    it('should apply link variant class', () => {
      component.variant = 'link';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.classList.contains('link')).toBe(true);
    });
  });

  describe('Click Event Handling', () => {
    it('should emit clicked event when button is clicked', () => {
      const emitSpy = vi.fn();
      component.clicked.subscribe(emitSpy);

      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      buttonElement.click();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should call handleClick when button is clicked', () => {
      const handleClickSpy = vi.spyOn(component, 'handleClick');

      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      buttonElement.click();

      expect(handleClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should throttle rapid clicks (2 second throttle)', async () => {
      vi.useFakeTimers();
      const emitSpy = vi.fn();
      component.clicked.subscribe(emitSpy);

      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      // Click multiple times rapidly
      buttonElement.click();
      buttonElement.click();
      buttonElement.click();

      // Only first click should emit
      expect(emitSpy).toHaveBeenCalledTimes(1);

      // Advance time by 2 seconds
      vi.advanceTimersByTime(2000);

      // Now another click should work
      buttonElement.click();
      expect(emitSpy).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should not emit if clicked rapidly within throttle window', async () => {
      vi.useFakeTimers();
      const emitSpy = vi.fn();
      component.clicked.subscribe(emitSpy);

      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      buttonElement.click();

      // Advance time by 1 second (within throttle window)
      vi.advanceTimersByTime(1000);
      buttonElement.click();

      // Still only one emission
      expect(emitSpy).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe('Button Text Content', () => {
    it('should handle empty button text', () => {
      component.buttonText = '';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.textContent?.trim()).toBe('');
    });

    it('should handle long button text', () => {
      const longText = 'This is a very long button text that should still render properly';
      component.buttonText = longText;
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.textContent?.trim()).toBe(longText);
    });

    it('should handle special characters in button text', () => {
      component.buttonText = 'Save & Exit <>';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.textContent?.trim()).toBe('Save & Exit <>');
    });

    it('should handle numeric button text', () => {
      component.buttonText = '123';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.textContent?.trim()).toBe('123');
    });

    it('should handle emoji in button text', () => {
      component.buttonText = '✓ Approve';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.textContent?.trim()).toBe('✓ Approve');
    });
  });

  describe('Edge Cases', () => {
    it('should initialize ngOnInit without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle multiple subscriptions to clicked event', () => {
      const emitSpy1 = vi.fn();
      const emitSpy2 = vi.fn();

      component.clicked.subscribe(emitSpy1);
      component.clicked.subscribe(emitSpy2);

      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      buttonElement.click();

      expect(emitSpy1).toHaveBeenCalledTimes(1);
      expect(emitSpy2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Use Cases', () => {
    it('should work as a submit button in a form', () => {
      component.type = 'submit';
      component.buttonText = 'Submit Application';
      component.variant = 'primary';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.type).toBe('submit');
      expect(buttonElement.textContent?.trim()).toBe('Submit Application');
      expect(buttonElement.classList.contains('primary')).toBe(true);
    });

    it('should work as a cancel button', () => {
      component.type = 'button';
      component.buttonText = 'Cancel';
      component.variant = 'secondary';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.type).toBe('button');
      expect(buttonElement.textContent?.trim()).toBe('Cancel');
      expect(buttonElement.classList.contains('secondary')).toBe(true);
    });

    it('should work as a delete button', () => {
      component.type = 'button';
      component.buttonText = 'Delete';
      component.variant = 'danger';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.type).toBe('button');
      expect(buttonElement.textContent?.trim()).toBe('Delete');
      expect(buttonElement.classList.contains('danger')).toBe(true);
    });

    it('should work as a reset button', () => {
      component.type = 'reset';
      component.buttonText = 'Reset Form';
      component.variant = 'warning';
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      expect(buttonElement.type).toBe('reset');
      expect(buttonElement.textContent?.trim()).toBe('Reset Form');
      expect(buttonElement.classList.contains('warning')).toBe(true);
    });
  });

  describe('Accessibility Tests', () => {
    it('should have no accessibility violations with default state', async () => {
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with custom text', async () => {
      component.buttonText = 'Accessible Button';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with primary variant', async () => {
      component.variant = 'primary';
      component.buttonText = 'Primary Action';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with secondary variant', async () => {
      component.variant = 'secondary';
      component.buttonText = 'Secondary Action';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with success variant', async () => {
      component.variant = 'success';
      component.buttonText = 'Save';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with danger variant', async () => {
      component.variant = 'danger';
      component.buttonText = 'Delete';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with warning variant', async () => {
      component.variant = 'warning';
      component.buttonText = 'Warning';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with info variant', async () => {
      component.variant = 'info';
      component.buttonText = 'Learn More';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with ghost variant', async () => {
      component.variant = 'ghost';
      component.buttonText = 'Close';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with link variant', async () => {
      component.variant = 'link';
      component.buttonText = 'View Details';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations as submit button', async () => {
      component.type = 'submit';
      component.buttonText = 'Submit';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should meet WCAG 2.1 Level AA standards', async () => {
      component.buttonText = 'Accessible Submit';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should have proper semantic structure', async () => {
      component.buttonText = 'Semantic Button';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['best-practice'],
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should be keyboard accessible', () => {
      fixture.detectChanges();
      buttonElement = debugElement.query(By.css('button')).nativeElement;

      // Native button elements are inherently keyboard accessible
      expect(buttonElement.tagName.toLowerCase()).toBe('button');
    });
  });

  describe('Integration Tests', () => {
    it('should work as a standalone component', () => {
      component.buttonText = 'Standalone';
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('Standalone');
    });

    it('should maintain state across multiple change detections', () => {
      component.buttonText = 'Persistent';
      component.variant = 'success';
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      buttonElement = debugElement.query(By.css('button')).nativeElement;
      expect(buttonElement.textContent?.trim()).toBe('Persistent');
      expect(buttonElement.classList.contains('success')).toBe(true);
    });
  });
});
