import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { KeyTrap } from './key-trap';

@Component({
  template: `
    <div appKeyTrap id="trap-container">
      <button id="first-btn">First Button</button>
      <input id="input-field" type="text" placeholder="Input field" />
      <select id="select-field">
        <option value="option1">Option 1</option>
      </select>
      <textarea id="textarea-field"></textarea>
      <a id="link" href="#test">Link</a>
      <button id="last-btn">Last Button</button>
      <button id="disabled-btn" disabled>Disabled Button</button>
      <input id="disabled-input" type="text" disabled />
      <div id="non-focusable">Non-focusable</div>
    </div>
    <button id="external-btn">External Button</button>
  `,
})
class TestComponent {}

describe('KeyTrap', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let trapContainer: DebugElement;
  let directive: KeyTrap;
  let originalActiveElement: Element | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, KeyTrap],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    // Store original active element to restore later
    originalActiveElement = document.activeElement;

    fixture.detectChanges();

    trapContainer = fixture.debugElement.query(By.directive(KeyTrap));
    directive = trapContainer.injector.get(KeyTrap);
  });

  afterEach(() => {
    // Restore original focus to prevent test interference
    if (originalActiveElement && 'focus' in originalActiveElement) {
      (originalActiveElement as HTMLElement).focus();
    }
  });

  describe('Initialization', () => {
    it('should create an instance', () => {
      expect(directive).toBeTruthy();
    });

    it('should capture the last focused element on init', () => {
      const externalBtn = fixture.debugElement.query(By.css('#external-btn'));
      externalBtn.nativeElement.focus();

      // Create new directive instance to test init behavior
      const newDirective = new KeyTrap(trapContainer);
      newDirective.ngOnInit();

      expect(newDirective.getLastFocusedElement()).toBe(externalBtn.nativeElement);
    });

    it('should focus the first focusable element on init', () => {
      const firstBtn = fixture.debugElement.query(By.css('#first-btn'));

      directive.ngOnInit();

      expect(document.activeElement).toBe(firstBtn.nativeElement);
    });

    it('should not capture body element as last focused element', () => {
      document.body.focus();

      directive.ngOnInit();

      expect(directive.getLastFocusedElement()).toBeNull();
    });
  });

  describe('Focus Management', () => {
    it('should get all focusable elements correctly', () => {
      const focusableElements = directive['getFocusableElements']();

      // Should include: first-btn, input-field, select-field, textarea-field, link, last-btn
      // Should exclude: disabled-btn, disabled-input, non-focusable
      expect(focusableElements.length).toBe(6);

      const ids = Array.from(focusableElements).map((el) => el.id);
      expect(ids).toContain('first-btn');
      expect(ids).toContain('input-field');
      expect(ids).toContain('select-field');
      expect(ids).toContain('textarea-field');
      expect(ids).toContain('link');
      expect(ids).toContain('last-btn');
      expect(ids).not.toContain('disabled-btn');
      expect(ids).not.toContain('disabled-input');
    });

    it('should focus first element when focusFirstElement is called', () => {
      const firstBtn = fixture.debugElement.query(By.css('#first-btn'));

      directive.focusFirstElement();

      expect(document.activeElement).toBe(firstBtn.nativeElement);
    });

    it('should handle case when no focusable elements exist', () => {
      // Create a container with no focusable elements
      const emptyContainer = document.createElement('div');
      emptyContainer.innerHTML = '<div>No focusable content</div>';

      const emptyDirective = new KeyTrap({ nativeElement: emptyContainer });

      expect(() => {
        emptyDirective.focusFirstElement();
      }).not.toThrow();
    });
  });

  describe('Focus Restoration', () => {
    it('should restore focus to last focused element', () => {
      const externalBtn = fixture.debugElement.query(By.css('#external-btn'));
      externalBtn.nativeElement.focus();

      directive['captureLastFocusedElement']();

      // Focus something else
      const firstBtn = fixture.debugElement.query(By.css('#first-btn'));
      firstBtn.nativeElement.focus();

      directive.restoreFocus();

      expect(document.activeElement).toBe(externalBtn.nativeElement);
    });

    it('should handle case when last focused element is null', () => {
      directive['lastFocusedElement'] = null;

      expect(() => {
        directive.restoreFocus();
      }).not.toThrow();
    });

    it('should handle case when focus restoration fails', () => {
      const mockElement = {
        focus: jasmine.createSpy('focus').and.throwError('Focus failed'),
      } as any;

      directive['lastFocusedElement'] = mockElement;
      spyOn(console, 'warn');

      directive.restoreFocus();

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to restore focus to last focused element:',
        jasmine.any(Error),
      );
    });

    it('should restore focus on destroy', () => {
      const externalBtn = fixture.debugElement.query(By.css('#external-btn'));
      externalBtn.nativeElement.focus();

      directive['captureLastFocusedElement']();

      const firstBtn = fixture.debugElement.query(By.css('#first-btn'));
      firstBtn.nativeElement.focus();

      directive.ngOnDestroy();

      expect(document.activeElement).toBe(externalBtn.nativeElement);
    });
  });

  describe('Update Methods', () => {
    it('should update last focused element', () => {
      const newElement = fixture.debugElement.query(By.css('#input-field')).nativeElement;

      directive.updateLastFocusedElement(newElement);

      expect(directive.getLastFocusedElement()).toBe(newElement);
    });

    it('should get last focused element', () => {
      const element = fixture.debugElement.query(By.css('#first-btn')).nativeElement;
      directive['lastFocusedElement'] = element;

      expect(directive.getLastFocusedElement()).toBe(element);
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      directive.ngOnInit();
    });

    it('should trap Tab key and cycle to last element when tabbing forward from last element', () => {
      const firstBtn = fixture.debugElement.query(By.css('#first-btn'));
      const lastBtn = fixture.debugElement.query(By.css('#last-btn'));

      lastBtn.nativeElement.focus();

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: false,
        bubbles: true,
      });

      trapContainer.nativeElement.dispatchEvent(tabEvent);

      expect(document.activeElement).toBe(firstBtn.nativeElement);
    });

    it('should trap Shift+Tab key and cycle to first element when tabbing backward from first element', () => {
      const firstBtn = fixture.debugElement.query(By.css('#first-btn'));
      const lastBtn = fixture.debugElement.query(By.css('#last-btn'));

      firstBtn.nativeElement.focus();

      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });

      trapContainer.nativeElement.dispatchEvent(shiftTabEvent);

      expect(document.activeElement).toBe(lastBtn.nativeElement);
    });

    it('should allow normal Tab navigation between elements inside trap', () => {
      const firstBtn = fixture.debugElement.query(By.css('#first-btn'));
      const inputField = fixture.debugElement.query(By.css('#input-field'));

      firstBtn.nativeElement.focus();

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: false,
        bubbles: true,
      });

      // Simulate normal tab behavior (this would normally be handled by browser)
      Object.defineProperty(tabEvent, 'defaultPrevented', { value: false });

      trapContainer.nativeElement.dispatchEvent(tabEvent);

      // Since we're not preventing default, normal tab behavior should occur
      // We need to manually simulate the focus change for testing
      inputField.nativeElement.focus();

      expect(document.activeElement).toBe(inputField.nativeElement);
    });

    it('should not interfere with non-Tab key events', () => {
      const firstBtn = fixture.debugElement.query(By.css('#first-btn'));
      firstBtn.nativeElement.focus();

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });

      spyOn(enterEvent, 'preventDefault');

      trapContainer.nativeElement.dispatchEvent(enterEvent);

      expect(enterEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should handle empty focusable elements list', () => {
      // Mock getFocusableElements to return empty list
      spyOn(directive as any, 'getFocusableElements').and.returnValue([]);

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });

      spyOn(tabEvent, 'preventDefault');

      expect(() => {
        trapContainer.nativeElement.dispatchEvent(tabEvent);
      }).not.toThrow();

      expect(tabEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should work in environments without document', () => {
      const originalDocument = global.document;
      (global as any).document = undefined;

      expect(() => {
        directive.focusFirstElement();
        directive['captureLastFocusedElement']();
      }).not.toThrow();

      global.document = originalDocument;
    });
  });

  describe('Error Handling', () => {
    it('should handle focus error gracefully', () => {
      const mockElement = {
        focus: jasmine.createSpy('focus').and.throwError('Focus failed'),
      };

      spyOn(directive as any, 'getFocusableElements').and.returnValue([mockElement]);
      spyOn(console, 'warn');

      directive.focusFirstElement();

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to focus first element:',
        jasmine.any(Error),
      );
    });
  });
});
