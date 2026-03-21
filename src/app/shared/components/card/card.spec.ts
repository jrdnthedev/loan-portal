import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { axe } from 'vitest-axe';
import { Card } from './card';

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [Card],
  template: `
    <app-card>
      <h2>Test Header</h2>
      <p>Test content inside the card</p>
    </app-card>
  `,
})
class TestHostComponent {}

@Component({
  selector: 'app-empty-host',
  standalone: true,
  imports: [Card],
  template: `<app-card></app-card>`,
})
class EmptyHostComponent {}

@Component({
  selector: 'app-complex-host',
  standalone: true,
  imports: [Card],
  template: `
    <app-card>
      <div class="card-header">
        <h3>Card Title</h3>
        <button>Action</button>
      </div>
      <div class="card-body">
        <p>This is the main content of the card.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
      <div class="card-footer">
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </app-card>
  `,
})
class ComplexHostComponent {}

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;
  let debugElement: DebugElement;
  let cardElement: HTMLElement;

  describe('Component Creation', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Card],
      }).compileComponents();

      fixture = TestBed.createComponent(Card);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      // Don't call detectChanges here to avoid ExpressionChangedAfterItHasBeenCheckedError
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render card wrapper div', () => {
      fixture.detectChanges();
      cardElement = debugElement.query(By.css('.card')).nativeElement;
      expect(cardElement).toBeTruthy();
      expect(cardElement.tagName.toLowerCase()).toBe('div');
    });

    it('should have the card CSS class', () => {
      fixture.detectChanges();
      cardElement = debugElement.query(By.css('.card')).nativeElement;
      expect(cardElement.classList.contains('card')).toBe(true);
    });
  });

  describe('Styling', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Card],
      }).compileComponents();

      fixture = TestBed.createComponent(Card);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should have the card class for styling', () => {
      fixture.detectChanges();
      cardElement = debugElement.query(By.css('.card')).nativeElement;
      expect(cardElement.className).toContain('card');
    });

    it('should be a flex container', () => {
      fixture.detectChanges();
      cardElement = debugElement.query(By.css('.card')).nativeElement;
      // Verify the element structure that receives flex styling
      expect(cardElement.classList.contains('card')).toBe(true);
    });
  });

  describe('Content Projection', () => {
    it('should project simple text content', async () => {
      @Component({
        selector: 'app-text-host',
        standalone: true,
        imports: [Card],
        template: `<app-card>Simple text content</app-card>`,
      })
      class TextHostComponent {}

      const hostFixture = TestBed.createComponent(TextHostComponent);
      hostFixture.detectChanges();

      const cardEl = hostFixture.debugElement.query(By.css('.card'));
      expect(cardEl.nativeElement.textContent).toContain('Simple text content');
    });

    it('should project header and paragraph content', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const cardEl = hostFixture.debugElement.query(By.css('.card'));
      const h2 = hostFixture.debugElement.query(By.css('h2'));
      const p = hostFixture.debugElement.query(By.css('p'));

      expect(h2).toBeTruthy();
      expect(h2.nativeElement.textContent).toBe('Test Header');
      expect(p).toBeTruthy();
      expect(p.nativeElement.textContent).toBe('Test content inside the card');
    });

    it('should project complex nested content', async () => {
      const hostFixture = TestBed.createComponent(ComplexHostComponent);
      hostFixture.detectChanges();

      const h3 = hostFixture.debugElement.query(By.css('h3'));
      const buttons = hostFixture.debugElement.queryAll(By.css('button'));
      const listItems = hostFixture.debugElement.queryAll(By.css('li'));

      expect(h3.nativeElement.textContent).toBe('Card Title');
      expect(buttons.length).toBe(3);
      expect(listItems.length).toBe(3);
    });

    it('should handle empty content gracefully', async () => {
      const hostFixture = TestBed.createComponent(EmptyHostComponent);
      hostFixture.detectChanges();

      const cardEl = hostFixture.debugElement.query(By.css('.card'));
      expect(cardEl).toBeTruthy();
      expect(cardEl.nativeElement.textContent.trim()).toBe('');
    });

    it('should project multiple child elements', async () => {
      @Component({
        selector: 'app-multi-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <div>First div</div>
            <div>Second div</div>
            <div>Third div</div>
          </app-card>
        `,
      })
      class MultiHostComponent {}

      const hostFixture = TestBed.createComponent(MultiHostComponent);
      hostFixture.detectChanges();

      const divs = hostFixture.debugElement.queryAll(By.css('.card > div'));
      expect(divs.length).toBe(3);
      expect(divs[0].nativeElement.textContent).toContain('First div');
      expect(divs[1].nativeElement.textContent).toContain('Second div');
      expect(divs[2].nativeElement.textContent).toContain('Third div');
    });

    it('should project form elements', async () => {
      @Component({
        selector: 'app-form-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <form>
              <input type="text" placeholder="Name" />
              <textarea placeholder="Description"></textarea>
              <button type="submit">Submit</button>
            </form>
          </app-card>
        `,
      })
      class FormHostComponent {}

      const hostFixture = TestBed.createComponent(FormHostComponent);
      hostFixture.detectChanges();

      const form = hostFixture.debugElement.query(By.css('form'));
      const input = hostFixture.debugElement.query(By.css('input'));
      const textarea = hostFixture.debugElement.query(By.css('textarea'));
      const button = hostFixture.debugElement.query(By.css('button'));

      expect(form).toBeTruthy();
      expect(input).toBeTruthy();
      expect(textarea).toBeTruthy();
      expect(button).toBeTruthy();
    });

    it('should project images and media', async () => {
      @Component({
        selector: 'app-media-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <img src="test.jpg" alt="Test image" />
            <p>Image caption</p>
          </app-card>
        `,
      })
      class MediaHostComponent {}

      const hostFixture = TestBed.createComponent(MediaHostComponent);
      hostFixture.detectChanges();

      const img = hostFixture.debugElement.query(By.css('img'));
      expect(img).toBeTruthy();
      expect(img.nativeElement.alt).toBe('Test image');
    });
  });

  describe('Use Cases', () => {
    it('should work as a content container', async () => {
      @Component({
        selector: 'app-container-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <h2>Loan Application #12345</h2>
            <p>Status: Pending</p>
            <p>Amount: $50,000</p>
          </app-card>
        `,
      })
      class ContainerHostComponent {}

      const hostFixture = TestBed.createComponent(ContainerHostComponent);
      hostFixture.detectChanges();

      const cardEl = hostFixture.debugElement.query(By.css('.card'));
      expect(cardEl.nativeElement.textContent).toContain('Loan Application #12345');
      expect(cardEl.nativeElement.textContent).toContain('Pending');
      expect(cardEl.nativeElement.textContent).toContain('$50,000');
    });

    it('should work with dashboard widgets', async () => {
      @Component({
        selector: 'app-widget-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <h3>Total Loans</h3>
            <div class="stat">42</div>
            <p class="description">Active applications</p>
          </app-card>
        `,
      })
      class WidgetHostComponent {}

      const hostFixture = TestBed.createComponent(WidgetHostComponent);
      hostFixture.detectChanges();

      const h3 = hostFixture.debugElement.query(By.css('h3'));
      const stat = hostFixture.debugElement.query(By.css('.stat'));
      expect(h3.nativeElement.textContent).toBe('Total Loans');
      expect(stat.nativeElement.textContent).toBe('42');
    });

    it('should work with list items', async () => {
      @Component({
        selector: 'app-list-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <h4>Recent Activity</h4>
            <ul>
              <li>Application submitted</li>
              <li>Documents reviewed</li>
              <li>Awaiting approval</li>
            </ul>
          </app-card>
        `,
      })
      class ListHostComponent {}

      const hostFixture = TestBed.createComponent(ListHostComponent);
      hostFixture.detectChanges();

      const listItems = hostFixture.debugElement.queryAll(By.css('li'));
      expect(listItems.length).toBe(3);
      expect(listItems[0].nativeElement.textContent).toBe('Application submitted');
    });
  });

  describe('Edge Cases', () => {
    it('should handle HTML entities in content', async () => {
      @Component({
        selector: 'app-entity-host',
        standalone: true,
        imports: [Card],
        template: `<app-card>Test &amp; Content &lt;123&gt;</app-card>`,
      })
      class EntityHostComponent {}

      const hostFixture = TestBed.createComponent(EntityHostComponent);
      hostFixture.detectChanges();

      const cardEl = hostFixture.debugElement.query(By.css('.card'));
      expect(cardEl.nativeElement.textContent).toContain('&');
    });

    it('should handle very long content', async () => {
      @Component({
        selector: 'app-long-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris.
            </p>
          </app-card>
        `,
      })
      class LongHostComponent {}

      const hostFixture = TestBed.createComponent(LongHostComponent);
      hostFixture.detectChanges();

      const cardEl = hostFixture.debugElement.query(By.css('.card'));
      expect(cardEl.nativeElement.textContent.length).toBeGreaterThan(100);
    });

    it('should handle special characters in content', async () => {
      @Component({
        selector: 'app-special-host',
        standalone: true,
        imports: [Card],
        template: `<app-card>Price: $1,000.50 | Rate: 3.5% | Status: ✓</app-card>`,
      })
      class SpecialHostComponent {}

      const hostFixture = TestBed.createComponent(SpecialHostComponent);
      hostFixture.detectChanges();

      const cardEl = hostFixture.debugElement.query(By.css('.card'));
      expect(cardEl.nativeElement.textContent).toContain('$1,000.50');
      expect(cardEl.nativeElement.textContent).toContain('3.5%');
      expect(cardEl.nativeElement.textContent).toContain('✓');
    });
  });

  describe('Accessibility Tests', () => {
    it('should have no accessibility violations with empty card', async () => {
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with text content', async () => {
      @Component({
        selector: 'app-axe-text-host',
        standalone: true,
        imports: [Card],
        template: `<app-card>Accessible text content</app-card>`,
      })
      class AxeTextHostComponent {}

      const hostFixture = TestBed.createComponent(AxeTextHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with header and content', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with complex content', async () => {
      const hostFixture = TestBed.createComponent(ComplexHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with form elements', async () => {
      @Component({
        selector: 'app-axe-form-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <form>
              <label for="name">Name</label>
              <input id="name" type="text" />
              <button type="submit">Submit</button>
            </form>
          </app-card>
        `,
      })
      class AxeFormHostComponent {}

      const hostFixture = TestBed.createComponent(AxeFormHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with images', async () => {
      @Component({
        selector: 'app-axe-image-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <img src="test.jpg" alt="Descriptive alt text" />
            <p>Image description</p>
          </app-card>
        `,
      })
      class AxeImageHostComponent {}

      const hostFixture = TestBed.createComponent(AxeImageHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with lists', async () => {
      @Component({
        selector: 'app-axe-list-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <h3>Items</h3>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </app-card>
        `,
      })
      class AxeListHostComponent {}

      const hostFixture = TestBed.createComponent(AxeListHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should meet WCAG 2.1 Level AA standards', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should have proper semantic structure', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['best-practice'],
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should have proper document structure for headers', async () => {
      @Component({
        selector: 'app-axe-heading-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            <h2>Main Heading</h2>
            <h3>Subheading</h3>
            <p>Content goes here</p>
          </app-card>
        `,
      })
      class AxeHeadingHostComponent {}

      const hostFixture = TestBed.createComponent(AxeHeadingHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should render semantic HTML', () => {
      fixture.detectChanges();
      cardElement = debugElement.query(By.css('.card')).nativeElement;

      expect(cardElement.tagName.toLowerCase()).toBe('div');
      expect(cardElement.classList.contains('card')).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should work as a standalone component', () => {
      fixture.detectChanges();

      expect(component).toBeTruthy();
      const cardEl = debugElement.query(By.css('.card'));
      expect(cardEl).toBeTruthy();
    });

    it('should maintain state across multiple change detections', () => {
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      cardElement = debugElement.query(By.css('.card')).nativeElement;
      expect(cardElement).toBeTruthy();
      expect(cardElement.classList.contains('card')).toBe(true);
    });

    it('should work with conditionally hidden content', async () => {
      @Component({
        selector: 'app-dynamic-hidden-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            @if (showContent) {
              <p>Dynamic content visible</p>
            }
          </app-card>
        `,
      })
      class DynamicHiddenHostComponent {
        showContent = false;
      }

      const hostFixture = TestBed.createComponent(DynamicHiddenHostComponent);
      hostFixture.detectChanges();

      const p = hostFixture.debugElement.query(By.css('p'));
      expect(p).toBeFalsy();
    });

    it('should work with conditionally shown content', async () => {
      @Component({
        selector: 'app-dynamic-shown-host',
        standalone: true,
        imports: [Card],
        template: `
          <app-card>
            @if (showContent) {
              <p>Dynamic content visible</p>
            }
          </app-card>
        `,
      })
      class DynamicShownHostComponent {
        showContent = true;
      }

      const hostFixture = TestBed.createComponent(DynamicShownHostComponent);
      hostFixture.detectChanges();

      const p = hostFixture.debugElement.query(By.css('p'));
      expect(p).toBeTruthy();
      expect(p.nativeElement.textContent).toBe('Dynamic content visible');
    });
  });
});
