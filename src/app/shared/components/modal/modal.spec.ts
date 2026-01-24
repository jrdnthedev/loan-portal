import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Modal } from './modal';
import { KeyTrap } from '../../directives/key-trap';

@Component({
  template: `
    <app-modal [name]="modalName" (closeBtn)="onModalClose()">
      <h2>Modal Title</h2>
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

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;
  let debugElement: DebugElement;

  describe('Standalone Component', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal, KeyTrap],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.name).toBe('');
    });

    it('should emit closeBtn event when close method is called', () => {
      spyOn(component.closeBtn, 'emit');

      component.close();

      expect(component.closeBtn.emit).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal, KeyTrap],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should set modal name as ID and aria-labelledby', () => {
      component.name = 'test-modal';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.id).toBe('test-modal');
      expect(dialogElement.getAttribute('aria-labelledby')).toBe('test-modal');
    });

    it('should have proper ARIA attributes', () => {
      component.name = 'my-modal';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      expect(dialogElement.getAttribute('role')).toBe('dialog');
      expect(dialogElement.getAttribute('aria-modal')).toBe('true');
      expect(dialogElement.id).toBe('my-modal');
      expect(dialogElement.getAttribute('aria-labelledby')).toBe('my-modal');
    });
  });

  describe('Close Functionality', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal, KeyTrap],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should call close method when close button is clicked', () => {
      spyOn(component, 'close');

      const closeButton = debugElement.query(By.css('.close-button button')).nativeElement;
      closeButton.click();

      expect(component.close).toHaveBeenCalled();
    });

    it('should call close method when modal container is clicked', () => {
      spyOn(component, 'close');

      const modalContainer = debugElement.query(By.css('#modal-container')).nativeElement;
      modalContainer.click();

      expect(component.close).toHaveBeenCalled();
    });

    it('should NOT close when dialog content is clicked', () => {
      spyOn(component, 'close');

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;
      const event = new Event('click');
      spyOn(event, 'stopPropagation');

      dialogElement.dispatchEvent(event);

      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should emit closeBtn event when close is called', () => {
      spyOn(component.closeBtn, 'emit');

      component.close();

      expect(component.closeBtn.emit).toHaveBeenCalledWith();
    });
  });

  describe('DOM Structure', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal, KeyTrap],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should render modal container', () => {
      const modalContainer = debugElement.query(By.css('#modal-container'));
      expect(modalContainer).toBeTruthy();
    });

    it('should render dialog with key trap directive', () => {
      const dialogElement = debugElement.query(By.css('[appKeyTrap]'));
      expect(dialogElement).toBeTruthy();
    });

    it('should render close button', () => {
      const closeButton = debugElement.query(By.css('.close-button button'));
      expect(closeButton).toBeTruthy();
      expect(closeButton.nativeElement.textContent.trim()).toBe('x');
    });

    it('should have ng-content for content projection', () => {
      const ngContentElement = debugElement.query(By.css('ng-content'));
      expect(ngContentElement).toBeTruthy();
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal, KeyTrap],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should handle click events on modal container', () => {
      spyOn(component, 'close');

      const modalContainer = debugElement.query(By.css('#modal-container'));
      modalContainer.triggerEventHandler('click', null);

      expect(component.close).toHaveBeenCalled();
    });

    it('should handle click events on close button', () => {
      spyOn(component, 'close');

      const closeButton = debugElement.query(By.css('.close-button button'));
      closeButton.triggerEventHandler('click', null);

      expect(component.close).toHaveBeenCalled();
    });

    it('should stop propagation on dialog content click', () => {
      const dialogElement = debugElement.query(By.css('[role="dialog"]'));
      const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };

      dialogElement.triggerEventHandler('click', mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('With Projected Content', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostDebugElement: DebugElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal, KeyTrap],
        declarations: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostDebugElement = hostFixture.debugElement;
      hostFixture.detectChanges();
    });

    it('should project content correctly', () => {
      const headerElement = hostDebugElement.query(By.css('h2'));
      const paragraphElement = hostDebugElement.query(By.css('p'));
      const buttonElement = hostDebugElement.query(
        By.css('app-modal button:not(.close-button button)'),
      );

      expect(headerElement).toBeTruthy();
      expect(paragraphElement).toBeTruthy();
      expect(buttonElement).toBeTruthy();
      expect(headerElement.nativeElement.textContent).toBe('Modal Title');
      expect(paragraphElement.nativeElement.textContent).toBe('Modal content goes here');
    });

    it('should emit close event to parent component', () => {
      expect(hostComponent.modalClosed).toBeFalsy();

      const closeButton = hostDebugElement.query(By.css('.close-button button'));
      closeButton.nativeElement.click();

      expect(hostComponent.modalClosed).toBeTruthy();
    });

    it('should use provided name for modal ID', () => {
      const dialogElement = hostDebugElement.query(By.css('[role="dialog"]'));

      expect(dialogElement.nativeElement.id).toBe('test-modal');
      expect(dialogElement.nativeElement.getAttribute('aria-labelledby')).toBe('test-modal');
    });
  });

  describe('Accessibility Features', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Modal, KeyTrap],
      }).compileComponents();

      fixture = TestBed.createComponent(Modal);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should have proper modal accessibility attributes', () => {
      component.name = 'accessible-modal';
      fixture.detectChanges();

      const dialogElement = debugElement.query(By.css('[role="dialog"]')).nativeElement;

      expect(dialogElement.getAttribute('role')).toBe('dialog');
      expect(dialogElement.getAttribute('aria-modal')).toBe('true');
      expect(dialogElement.getAttribute('aria-labelledby')).toBe('accessible-modal');
      expect(dialogElement.id).toBe('accessible-modal');
    });

    it('should apply key trap directive for keyboard navigation', () => {
      const keyTrapElement = debugElement.query(By.css('[appKeyTrap]'));
      expect(keyTrapElement).toBeTruthy();
    });

    it('should have close button accessible via keyboard', () => {
      const closeButton = debugElement.query(By.css('.close-button button')).nativeElement;
      expect(closeButton.tagName.toLowerCase()).toBe('button');
    });
  });
});
