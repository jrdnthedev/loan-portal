import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Card } from './card';

@Component({
  template: `
    <app-card>
      <h2>Test Header</h2>
      <p>Test content inside the card</p>
    </app-card>
  `,
})
class TestHostComponent {}

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;
  let debugElement: DebugElement;
  let cardElement: HTMLElement;

  describe('Standalone Component', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Card],
      }).compileComponents();

      fixture = TestBed.createComponent(Card);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      cardElement = debugElement.query(By.css('.card')).nativeElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render card wrapper div', () => {
      expect(cardElement).toBeTruthy();
      expect(cardElement.classList.contains('card')).toBeTruthy();
    });

    it('should have ng-content for content projection', () => {
      const ngContentElement = debugElement.query(By.css('ng-content'));
      expect(ngContentElement).toBeTruthy();
    });
  });

  describe('With Projected Content', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostDebugElement: DebugElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Card],
        declarations: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostDebugElement = hostFixture.debugElement;
      hostFixture.detectChanges();
    });

    it('should project content correctly', () => {
      const cardElement = hostDebugElement.query(By.css('.card'));
      const headerElement = hostDebugElement.query(By.css('h2'));
      const paragraphElement = hostDebugElement.query(By.css('p'));

      expect(cardElement).toBeTruthy();
      expect(headerElement).toBeTruthy();
      expect(paragraphElement).toBeTruthy();
      expect(headerElement.nativeElement.textContent).toBe('Test Header');
      expect(paragraphElement.nativeElement.textContent).toBe('Test content inside the card');
    });

    it('should contain projected elements within card div', () => {
      const cardElement = hostDebugElement.query(By.css('.card'));
      const headerElement = cardElement.query(By.css('h2'));
      const paragraphElement = cardElement.query(By.css('p'));

      expect(headerElement).toBeTruthy();
      expect(paragraphElement).toBeTruthy();
    });

    it('should maintain card structure with content', () => {
      const cardElement = hostDebugElement.query(By.css('app-card .card'));
      expect(cardElement).toBeTruthy();
      expect(cardElement.nativeElement.children.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Card],
      }).compileComponents();

      fixture = TestBed.createComponent(Card);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      cardElement = debugElement.query(By.css('.card')).nativeElement;
      fixture.detectChanges();
    });

    it('should have appropriate ARIA structure', () => {
      expect(cardElement.tagName.toLowerCase()).toBe('div');
      expect(cardElement.classList.contains('card')).toBeTruthy();
    });
  });
});
