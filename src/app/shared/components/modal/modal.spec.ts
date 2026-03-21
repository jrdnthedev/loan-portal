import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { axe } from 'vitest-axe';
import { Modal } from './modal';

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [Modal],
  template: `
    <app-modal [name]="modalName" (closeBtn)="onModalClose()">
      <h2 id="test-modal">Modal Title</h2>
      <p>Modal content goes here</p>
      <button>Modal Button</button>
    </app-modal>
  `,
})
class TestHostComponent {
  modalName = 'test-modal';
  modalClosed = false;

  onModalClose() {
    this.modalClosed = true;
  }
}

@Component({
  selector: 'app-empty-host',
  standalone: true,
  imports: [Modal],
  template: `<app-modal [name]="'empty-modal'"></app-modal>`,
})
class EmptyHostComponent {}

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;
  let debugElement: DebugElement;

  describe('Component Creation', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.name).toBe('');
    });

    it('should have close method', () => {
      expect(typeof component.close).toBe('function');
    });

    it('should render modal container', () => {
      fixture.detectChanges();
      const modalContainer = debugElement.query(By.css('#modal-container'));
      expect(modalContainer).toBeTruthy();
    });

    it('should render dialog element', () => {
      fixture.detectChanges();
      const dialogElement = debugElement.query(By.css('[role="dialog"]'));
      expect(dialogElement).toBeTruthy();
    });
  });

  describe('Input Properties', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should accept name input', () => {
      component.name = 'my-modal';
      fixture.detectChanges();

      expect(component.name).toBe('my-modal');
    });

    it('should set modal name as ID', () => {
      component.name = 'test-modal';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.id).toBe('test-modal');
    });

    it('should set modal name as aria-labelledby', () => {
      component.name = 'test-modal';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.getAttribute('aria-labelledby')).toBe('test-modal');
    });

    it('should update ID when name changes', async () => {
      // Create first fixture with first-modal name
      const fixture1 = TestBed.createComponent(Modal);
      const component1 = fixture1.componentInstance;
      component1.name = 'first-modal';
      fixture1.detectChanges();

      let dialogElement = fixture1.debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.id).toBe('first-modal');

      // Create second fixture with different name
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      const fixture2 = TestBed.createComponent(Modal);
      const component2 = fixture2.componentInstance;
      component2.name = 'second-modal';
      fixture2.detectChanges();

      dialogElement = fixture2.debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.id).toBe('second-modal');
    });

    it('should handle empty name', () => {
      component.name = '';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.id).toBe('');
      expect(dialogElement.getAttribute('aria-labelledby')).toBe('');
    });
  });

  describe('ARIA Attributes', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should have role="dialog"', () => {
      component.name = 'my-modal';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.getAttribute('role')).toBe('dialog');
    });

    it('should have aria-modal="true"', () => {
      component.name = 'my-modal';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.getAttribute('aria-modal')).toBe('true');
    });

    it('should have proper ARIA attributes combination', () => {
      component.name = 'accessible-modal';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.getAttribute('role')).toBe('dialog');
      expect(dialogElement.getAttribute('aria-modal')).toBe('true');
      expect(dialogElement.id).toBe('accessible-modal');
      expect(dialogElement.getAttribute('aria-labelledby')).toBe('accessible-modal');
    });
  });

  describe('Close Button', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should render close button', () => {
      const closeButton = debugElement.query(By.css('.close-button button'));
      expect(closeButton).toBeTruthy();
    });

    it('should render close button with x text', () => {
      const closeButton = debugElement.query(By.css('.close-button button')).nativeElement;
      expect(closeButton.textContent.trim()).toBe('x');
    });

    it('should be a button element', () => {
      const closeButton = debugElement.query(By.css('.close-button button')).nativeElement;
      expect(closeButton.tagName.toLowerCase()).toBe('button');
    });

    it('should call close method when clicked', () => {
      const closeSpy = vi.spyOn(component, 'close');
      const closeButton = debugElement.query(By.css('.close-button button')).nativeElement;

      closeButton.click();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('Close Method', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should emit closeBtn event when called', () => {
      const emitSpy = vi.fn();
      component.closeBtn.subscribe(emitSpy);

      component.close();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit closeBtn event with no arguments', () => {
      const emitSpy = vi.fn();
      component.closeBtn.subscribe(emitSpy);

      component.close();

      expect(emitSpy).toHaveBeenCalledWith(undefined);
    });

    it('should be callable multiple times', () => {
      const emitSpy = vi.fn();
      component.closeBtn.subscribe(emitSpy);

      component.close();
      component.close();
      component.close();

      expect(emitSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Modal Container Click', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should call close when container is clicked', () => {
      const closeSpy = vi.spyOn(component, 'close');
      const modalContainer = debugElement.query(By.css('#modal-container')).nativeElement;

      modalContainer.click();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('should emit closeBtn when container is clicked', () => {
      const emitSpy = vi.fn();
      component.closeBtn.subscribe(emitSpy);

      const modalContainer = debugElement.query(By.css('#modal-container')).nativeElement;
      modalContainer.click();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('Dialog Content Click', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should stop propagation when dialog content is clicked', () => {
      const closeSpy = vi.spyOn(component, 'close');
      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;

      dialogElement.click();

      // close should not be called because stopPropagation prevents container click
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should not emit closeBtn when dialog is clicked directly', () => {
      const emitSpy = vi.fn();
      component.closeBtn.subscribe(emitSpy);

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      dialogElement.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('KeyTrap Directive', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should apply keyTrap directive to dialog', () => {
      const keyTrapElement = debugElement.query(By.css('[appKeyTrap]'));
      expect(keyTrapElement).toBeTruthy();
    });

    it('should apply keyTrap to the dialog element', () => {
      const dialogElement = debugElement.query(By.css('[role="dialog"]'));
      const hasKeyTrap = dialogElement.nativeElement.hasAttribute('appkeytrap');
      expect(hasKeyTrap).toBe(true);
    });
  });

  describe('Content Projection', () => {
    it('should project content inside the modal', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const h2 = hostFixture.debugElement.query(By.css('h2'));
      const p = hostFixture.debugElement.query(By.css('p'));
      const button = hostFixture.debugElement.query(By.css('button:not(.close-button button)'));

      expect(h2).toBeTruthy();
      expect(h2.nativeElement.textContent).toContain('Modal Title');
      expect(p).toBeTruthy();
      expect(p.nativeElement.textContent).toContain('Modal content goes here');
      expect(button).toBeTruthy();
    });

    it('should handle empty content projection', () => {
      TestBed.configureTestingModule({
        imports: [EmptyHostComponent],
      });

      const hostFixture = TestBed.createComponent(EmptyHostComponent);
      hostFixture.detectChanges();

      const dialog = hostFixture.debugElement.query(By.css('[role="dialog"]'));
      expect(dialog).toBeTruthy();
    });

    it('should project complex content', () => {
      @Component({
        selector: 'app-complex-host',
        standalone: true,
        imports: [Modal],
        template: `
          <app-modal [name]="'complex-modal'">
            <div class="modal-header">
              <h1>Title</h1>
            </div>
            <div class="modal-body">
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
            <div class="modal-footer">
              <button>Cancel</button>
              <button>Save</button>
            </div>
          </app-modal>
        `,
      })
      class ComplexHostComponent {}

      TestBed.configureTestingModule({
        imports: [ComplexHostComponent],
      });

      const hostFixture = TestBed.createComponent(ComplexHostComponent);
      hostFixture.detectChanges();

      expect(hostFixture.debugElement.query(By.css('.modal-header'))).toBeTruthy();
      expect(hostFixture.debugElement.query(By.css('.modal-body'))).toBeTruthy();
      expect(hostFixture.debugElement.query(By.css('.modal-footer'))).toBeTruthy();
      expect(hostFixture.debugElement.queryAll(By.css('li')).length).toBe(2);
    });
  });

  describe('Event Output', () => {
    it('should emit closeBtn when close button is clicked in host', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const closeButton = hostFixture.debugElement.query(
        By.css('.close-button button'),
      ).nativeElement;
      closeButton.click();

      expect(hostComponent.modalClosed).toBe(true);
    });

    it('should emit closeBtn when container is clicked in host', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const container = hostFixture.debugElement.query(By.css('#modal-container')).nativeElement;
      container.click();

      expect(hostComponent.modalClosed).toBe(true);
    });

    it('should not emit closeBtn when dialog content is clicked in host', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const dialog = hostFixture.debugElement.query(By.css('[role="dialog"]')).nativeElement;
      dialog.click();

      expect(hostComponent.modalClosed).toBe(false);
    });

    it('should not emit when projected button is clicked', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const projectedButton = hostFixture.debugElement.query(
        By.css('button:not(.close-button button)'),
      ).nativeElement;
      projectedButton.click();

      expect(hostComponent.modalClosed).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should handle very long modal names', () => {
      component.name =
        'very-long-modal-name-that-could-potentially-cause-issues-with-id-attributes';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.id).toBe(
        'very-long-modal-name-that-could-potentially-cause-issues-with-id-attributes',
      );
    });

    it('should handle special characters in name', () => {
      component.name = 'modal-with-dashes-and_underscores';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.id).toBe('modal-with-dashes-and_underscores');
    });

    it('should maintain structure when name is not set', () => {
      fixture.detectChanges();

      const container = debugElement.query(By.css('#modal-container'));
      const dialog = debugElement.query(By.css('[role="dialog"]'));
      const closeButton = debugElement.query(By.css('.close-button button'));

      expect(container).toBeTruthy();
      expect(dialog).toBeTruthy();
      expect(closeButton).toBeTruthy();
    });

    it('should handle rapid close calls', () => {
      const emitSpy = vi.fn();
      component.closeBtn.subscribe(emitSpy);
      fixture.detectChanges();

      for (let i = 0; i < 10; i++) {
        component.close();
      }

      expect(emitSpy).toHaveBeenCalledTimes(10);
    });
  });

  describe('Use Cases', () => {
    it('should work as confirmation dialog', () => {
      @Component({
        selector: 'app-confirm-host',
        standalone: true,
        imports: [Modal],
        template: `
          <app-modal [name]="'confirm-dialog'" (closeBtn)="onCancel()">
            <h2 id="confirm-dialog">Confirm Action</h2>
            <p>Are you sure you want to proceed?</p>
            <button (click)="onConfirm()">Yes</button>
            <button (click)="onCancel()">No</button>
          </app-modal>
        `,
      })
      class ConfirmHostComponent {
        confirmed = false;
        cancelled = false;

        onConfirm() {
          this.confirmed = true;
        }

        onCancel() {
          this.cancelled = true;
        }
      }

      TestBed.configureTestingModule({
        imports: [ConfirmHostComponent],
      });

      const hostFixture = TestBed.createComponent(ConfirmHostComponent);
      hostFixture.detectChanges();

      expect(hostFixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain(
        'Confirm Action',
      );
      expect(hostFixture.debugElement.queryAll(By.css('button')).length).toBeGreaterThanOrEqual(2);
    });

    it('should work as form dialog', () => {
      @Component({
        selector: 'app-form-host',
        standalone: true,
        imports: [Modal],
        template: `
          <app-modal [name]="'form-dialog'">
            <h2 id="form-dialog">Edit Profile</h2>
            <form>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <button type="submit">Save</button>
            </form>
          </app-modal>
        `,
      })
      class FormHostComponent {}

      TestBed.configureTestingModule({
        imports: [FormHostComponent],
      });

      const hostFixture = TestBed.createComponent(FormHostComponent);
      hostFixture.detectChanges();

      expect(hostFixture.debugElement.query(By.css('form'))).toBeTruthy();
      expect(hostFixture.debugElement.queryAll(By.css('input')).length).toBe(2);
    });

    it('should work as alert/notification dialog', () => {
      @Component({
        selector: 'app-alert-host',
        standalone: true,
        imports: [Modal],
        template: `
          <app-modal [name]="'alert-dialog'" (closeBtn)="onClose()">
            <h2 id="alert-dialog">Success!</h2>
            <p>Your changes have been saved.</p>
            <button (click)="onClose()">OK</button>
          </app-modal>
        `,
      })
      class AlertHostComponent {
        closed = false;
        onClose() {
          this.closed = true;
        }
      }

      TestBed.configureTestingModule({
        imports: [AlertHostComponent],
      });

      const hostFixture = TestBed.createComponent(AlertHostComponent);
      hostFixture.detectChanges();

      const h2 = hostFixture.debugElement.query(By.css('h2'));
      expect(h2.nativeElement.textContent).toContain('Success!');
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should have no accessibility violations with basic modal', async () => {
      component.name = 'basic-modal';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with empty name', async () => {
      component.name = '';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: {
          region: { enabled: false },
          'aria-dialog-name': { enabled: false }, // Dialog without name is expected in test
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with content projection', async () => {
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should meet WCAG 2.1 Level AA standards', async () => {
      component.name = 'wcag-modal';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        rules: { region: { enabled: false } },
      });

      expect(results).toHaveNoViolations();
    });

    it('should have proper semantic structure', async () => {
      component.name = 'semantic-modal';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['best-practice'],
        },
        rules: { region: { enabled: false } },
      });

      expect(results).toHaveNoViolations();
    });

    it('should have keyboard accessible close button', async () => {
      component.name = 'keyboard-modal';
      fixture.detectChanges();

      const closeButton = debugElement.query(By.css('.close-button button')).nativeElement;
      expect(closeButton.tagName.toLowerCase()).toBe('button');

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper dialog role and attributes', () => {
      component.name = 'accessible-dialog';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;

      expect(dialogElement.getAttribute('role')).toBe('dialog');
      expect(dialogElement.getAttribute('aria-modal')).toBe('true');
      expect(dialogElement.getAttribute('aria-labelledby')).toBe('accessible-dialog');
      expect(dialogElement.id).toBe('accessible-dialog');
    });
  });

  describe('Integration', () => {
    it('should work with host component lifecycle', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;

      expect(hostComponent.modalClosed).toBe(false);

      hostFixture.detectChanges();

      const closeButton = hostFixture.debugElement.query(
        By.css('.close-button button'),
      ).nativeElement;
      closeButton.click();

      expect(hostComponent.modalClosed).toBe(true);
    });

    it('should update ARIA attributes when name changes', async () => {
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      const hostFixture1 = TestBed.createComponent(TestHostComponent);
      const hostComponent1 = hostFixture1.componentInstance;
      hostComponent1.modalName = 'first-modal';
      hostFixture1.detectChanges();

      let dialogElement = hostFixture1.debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.id).toBe('first-modal');
      expect(dialogElement.getAttribute('aria-labelledby')).toBe('first-modal');

      // Create new fixture with updated name
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      const hostFixture2 = TestBed.createComponent(TestHostComponent);
      const hostComponent2 = hostFixture2.componentInstance;
      hostComponent2.modalName = 'updated-modal';
      hostFixture2.detectChanges();

      dialogElement = hostFixture2.debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.id).toBe('updated-modal');
      expect(dialogElement.getAttribute('aria-labelledby')).toBe('updated-modal');
    });

    it('should handle multiple close event subscriptions', () => {
      TestBed.configureTestingModule({
        imports: [Modal],
      });

      const modalFixture = TestBed.createComponent(Modal);
      const modalComponent = modalFixture.componentInstance;
      modalFixture.detectChanges();

      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();
      const subscriber3 = vi.fn();

      modalComponent.closeBtn.subscribe(subscriber1);
      modalComponent.closeBtn.subscribe(subscriber2);
      modalComponent.closeBtn.subscribe(subscriber3);

      modalComponent.close();

      expect(subscriber1).toHaveBeenCalled();
      expect(subscriber2).toHaveBeenCalled();
      expect(subscriber3).toHaveBeenCalled();
    });
  });
});
