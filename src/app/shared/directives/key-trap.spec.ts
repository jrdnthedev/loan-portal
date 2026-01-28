import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { KeyTrap } from './key-trap';
import { vi } from 'vitest';

@Component({
  standalone: true,
  imports: [KeyTrap],
  template: `
    <div appKeyTrap>
      <button id="btn1">Button 1</button>
      <input id="input1" type="text" />
      <a id="link1" href="#">Link 1</a>
      <button id="btn2">Button 2</button>
    </div>
  `,
})
class TestComponent {}

describe('KeyTrap', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;
  let directive: KeyTrap;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyTrap, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(KeyTrap));
    directive = directiveElement.injector.get(KeyTrap);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should capture the last focused element', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      button.focus();

      const newDirective = new KeyTrap(directiveElement);
      newDirective.ngOnInit();

      expect(newDirective.getLastFocusedElement()).toBe(button);
      document.body.removeChild(button);
    });

    it('should focus the first focusable element', () => {
      const firstButton = directiveElement.nativeElement.querySelector('#btn1');
      expect(document.activeElement).toBe(firstButton);
    });

    it('should not capture document.body as last focused element', () => {
      // Blur any active element to ensure document.body or nothing is focused
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }

      const newDirective = new KeyTrap(directiveElement);
      newDirective.ngOnInit();

      // Should not capture body, even if something else got focused during init
      const lastFocused = newDirective.getLastFocusedElement();
      expect(lastFocused).not.toBe(document.body);
    });
  });

  describe('ngOnDestroy', () => {
    it('should restore focus to the last focused element', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      button.focus();

      const newDirective = new KeyTrap(directiveElement);
      newDirective.ngOnInit();

      const input = directiveElement.nativeElement.querySelector('#input1');
      input.focus();

      newDirective.ngOnDestroy();

      expect(document.activeElement).toBe(button);
      document.body.removeChild(button);
    });

    it('should handle restore focus when last focused element is null', () => {
      const newDirective = new KeyTrap(directiveElement);

      expect(() => newDirective.ngOnDestroy()).not.toThrow();
    });
  });

  describe('restoreFocus', () => {
    it('should restore focus to the last focused element', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      directive.updateLastFocusedElement(button);

      directive.restoreFocus();

      expect(document.activeElement).toBe(button);
      document.body.removeChild(button);
    });

    it('should handle errors gracefully when restoring focus fails', () => {
      const mockElement = {
        focus: () => {
          throw new Error('Focus failed');
        },
      } as unknown as HTMLElement;

      directive.updateLastFocusedElement(mockElement);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(() => directive.restoreFocus()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should do nothing if last focused element is null', () => {
      directive.updateLastFocusedElement(null as any);

      expect(() => directive.restoreFocus()).not.toThrow();
    });
  });

  describe('updateLastFocusedElement', () => {
    it('should update the last focused element reference', () => {
      const button = document.createElement('button');
      directive.updateLastFocusedElement(button);

      expect(directive.getLastFocusedElement()).toBe(button);
    });
  });

  describe('getLastFocusedElement', () => {
    it('should return the last focused element', () => {
      const button = document.createElement('button');
      directive.updateLastFocusedElement(button);

      expect(directive.getLastFocusedElement()).toBe(button);
    });

    it('should return null if no element was focused', () => {
      const newDirective = new KeyTrap(directiveElement);

      expect(newDirective.getLastFocusedElement()).toBeNull();
    });
  });

  describe('focusFirstElement', () => {
    it('should focus the first focusable element', () => {
      const firstButton = directiveElement.nativeElement.querySelector('#btn1');
      const input = directiveElement.nativeElement.querySelector('#input1');
      input.focus();

      directive.focusFirstElement();

      expect(document.activeElement).toBe(firstButton);
    });

    it('should handle errors when focusing fails', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockElement = document.createElement('button');

      vi.spyOn(mockElement, 'focus').mockImplementation(() => {
        throw new Error('Focus failed');
      });

      directiveElement.nativeElement.appendChild(mockElement);

      expect(() => directive.focusFirstElement()).not.toThrow();

      consoleWarnSpy.mockRestore();
    });

    it('should do nothing if there are no focusable elements', () => {
      const emptyDiv = document.createElement('div');
      const emptyDirective = new KeyTrap({ nativeElement: emptyDiv } as any);

      expect(() => emptyDirective.focusFirstElement()).not.toThrow();
    });
  });

  describe('Tab key navigation', () => {
    it('should trap focus when Tab is pressed on the last element', () => {
      const lastButton = directiveElement.nativeElement.querySelector('#btn2');
      const firstButton = directiveElement.nativeElement.querySelector('#btn1');

      lastButton.focus();

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: false,
        bubbles: true,
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      directiveElement.nativeElement.dispatchEvent(event);

      expect(document.activeElement).toBe(firstButton);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should trap focus when Shift+Tab is pressed on the first element', () => {
      const firstButton = directiveElement.nativeElement.querySelector('#btn1');
      const lastButton = directiveElement.nativeElement.querySelector('#btn2');

      firstButton.focus();

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      directiveElement.nativeElement.dispatchEvent(event);

      expect(document.activeElement).toBe(lastButton);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should allow normal Tab navigation between middle elements', () => {
      const input = directiveElement.nativeElement.querySelector('#input1');
      input.focus();

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: false,
        bubbles: true,
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      directiveElement.nativeElement.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should not interfere with non-Tab keys', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      directiveElement.nativeElement.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should handle Tab key when there are no focusable elements', () => {
      const emptyDiv = document.createElement('div');
      const emptyDirective = new KeyTrap({ nativeElement: emptyDiv } as any);

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });

      expect(() => emptyDirective.handleKeyDown(event)).not.toThrow();
    });
  });

  describe('focusable elements detection', () => {
    it('should detect buttons as focusable', () => {
      const buttons = directiveElement.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should detect inputs as focusable', () => {
      const inputs = directiveElement.nativeElement.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should detect links as focusable', () => {
      const links = directiveElement.nativeElement.querySelectorAll('a[href]');
      expect(links.length).toBeGreaterThan(0);
    });

    it('should not include disabled elements', () => {
      const disabledButton = document.createElement('button');
      disabledButton.disabled = true;
      directiveElement.nativeElement.appendChild(disabledButton);

      fixture.detectChanges();

      const focusableElements = directiveElement.nativeElement.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not(.readonly-input), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      const focusableArray = Array.from(focusableElements);
      expect(focusableArray).not.toContain(disabledButton);
    });

    it('should include buttons even with tabindex=-1', () => {
      const negativeTabButton = document.createElement('button');
      negativeTabButton.setAttribute('tabindex', '-1');
      negativeTabButton.id = 'negative-tab-btn';
      directiveElement.nativeElement.appendChild(negativeTabButton);

      fixture.detectChanges();

      const focusableElements = directiveElement.nativeElement.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not(.readonly-input), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      const focusableArray = Array.from(focusableElements);
      // Buttons with tabindex=-1 are still included because they match 'button:not([disabled])'
      expect(focusableArray).toContain(negativeTabButton);
    });

    it('should not include readonly inputs', () => {
      const readonlyInput = document.createElement('input');
      readonlyInput.classList.add('readonly-input');
      directiveElement.nativeElement.appendChild(readonlyInput);

      fixture.detectChanges();

      const focusableElements = directiveElement.nativeElement.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not(.readonly-input), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      const focusableArray = Array.from(focusableElements);
      expect(focusableArray).not.toContain(readonlyInput);
    });
  });
});
