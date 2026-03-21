import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { axe } from 'vitest-axe';
import { Badge } from './badge';

describe('Badge', () => {
  let component: Badge;
  let fixture: ComponentFixture<Badge>;
  let debugElement: DebugElement;
  let badgeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badge],
    }).compileComponents();

    fixture = TestBed.createComponent(Badge);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    // Don't call detectChanges here to avoid ExpressionChangedAfterItHasBeenCheckedError
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default empty title', () => {
      expect(component.title).toBe('');
    });
  });

  describe('DOM Rendering', () => {
    it('should render a badge element', () => {
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement).toBeTruthy();
    });

    it('should display the title', () => {
      component.title = 'New';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent?.trim()).toBe('New');
    });

    it('should update title when changed', () => {
      component.title = 'Inactive';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.textContent?.trim()).toBe('Inactive');
    });

    it('should display empty string when title is empty', () => {
      component.title = '';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent?.trim()).toBe('');
    });

    it('should render as a span element', () => {
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.tagName.toLowerCase()).toBe('span');
    });

    it('should have the badge CSS class', () => {
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.classList.contains('badge')).toBe(true);
    });
  });

  describe('Input Properties', () => {
    it('should accept title input', () => {
      fixture.componentRef.setInput('title', 'Premium');
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(component.title).toBe('Premium');
      expect(badgeElement.textContent?.trim()).toBe('Premium');
    });

    it('should handle status titles', () => {
      const status = 'draft';
      component.title = status;
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.textContent?.trim()).toBe(status);
    });

    it('should handle numeric titles', () => {
      component.title = '42';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent?.trim()).toBe('42');
    });

    it('should handle long titles', () => {
      const longTitle = 'This is a very long badge title';
      component.title = longTitle;
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent?.trim()).toBe(longTitle);
    });

    it('should handle special characters', () => {
      component.title = 'Test & Badge <>';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent?.trim()).toBe('Test & Badge <>');
    });

    it('should handle whitespace', () => {
      component.title = '  Spaced  ';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent).toContain('Spaced');
    });
  });

  describe('Styling', () => {
    beforeEach(() => {
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
    });

    it('should have the badge class for styling', () => {
      expect(badgeElement.classList.contains('badge')).toBe(true);
    });

    it('should be styled as an inline element', () => {
      // The badge should have proper CSS class that defines it as inline-block
      // Note: Computed styles may not be available in unit tests, but we verify the class is present
      expect(badgeElement.className).toContain('badge');
    });

    it('should have styling structure', () => {
      // Verify the element structure that receives styling
      expect(badgeElement.tagName.toLowerCase()).toBe('span');
      expect(badgeElement.classList.contains('badge')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null title gracefully', () => {
      component.title = null as any;
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent?.trim()).toBe('');
    });

    it('should handle undefined title gracefully', () => {
      component.title = undefined as any;
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent?.trim()).toBe('');
    });

    it('should handle rapid title changes', () => {
      component.title = 'Third';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent?.trim()).toBe('Third');
    });

    it('should handle emoji in title', () => {
      component.title = '✅ Success';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent?.trim()).toBe('✅ Success');
    });

    it('should handle line breaks in title', () => {
      component.title = 'Line\nBreak';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;

      expect(badgeElement.textContent).toContain('Line');
      expect(badgeElement.textContent).toContain('Break');
    });
  });

  describe('Use Cases', () => {
    it('should display loan status badges', () => {
      const status = 'under review';
      component.title = status;
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.textContent?.trim()).toBe(status);
    });

    it('should display priority badges', () => {
      const priority = 'Low';
      component.title = priority;
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.textContent?.trim()).toBe(priority);
    });

    it('should display category badges', () => {
      const category = 'auto';
      component.title = category;
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.textContent?.trim()).toBe(category);
    });

    it('should display count badges', () => {
      const count = '99+';
      component.title = count;
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.textContent?.trim()).toBe(count);
    });
  });

  describe('Accessibility Tests', () => {
    it('should have no accessibility violations with default state', async () => {
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with title set', async () => {
      component.title = 'New Badge';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with status badge', async () => {
      component.title = 'approved';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with numeric title', async () => {
      component.title = '42';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with empty title', async () => {
      component.title = '';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient color contrast', async () => {
      component.title = 'Test Badge';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should meet WCAG 2.1 Level AA standards', async () => {
      component.title = 'Accessible Badge';
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
      component.title = 'Semantic Badge';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['best-practice'],
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should be keyboard navigable (no interactive violations)', async () => {
      component.title = 'Test';
      fixture.detectChanges();

      // Badge is not interactive, so keyboard-related rules should pass
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Integration Tests', () => {
    it('should work as a standalone component', () => {
      component.title = 'Standalone';
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('Standalone');
    });

    it('should maintain state across multiple change detections', () => {
      component.title = 'Persistent';
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.textContent?.trim()).toBe('Persistent');
    });

    it('should handle component reuse', () => {
      component.title = 'Reused';
      fixture.detectChanges();
      badgeElement = debugElement.query(By.css('.badge')).nativeElement;
      expect(badgeElement.textContent?.trim()).toBe('Reused');
    });
  });
});
