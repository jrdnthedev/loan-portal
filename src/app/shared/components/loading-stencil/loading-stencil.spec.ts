import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { axe } from 'vitest-axe';
import { LoadingStencil } from './loading-stencil';

describe('LoadingStencil', () => {
  let component: LoadingStencil;
  let fixture: ComponentFixture<LoadingStencil>;
  let debugElement: DebugElement;

  describe('Component Creation', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.type()).toBe('card');
      expect(component.count()).toBe(1);
      expect(component.rows()).toBe(3);
    });

    it('should render loading-stencil container', () => {
      fixture.detectChanges();

      const container = debugElement.query(By.css('.loading-stencil'));
      expect(container).toBeTruthy();
    });

    it('should set data-type attribute to default type', () => {
      fixture.detectChanges();

      const container = debugElement.query(By.css('.loading-stencil')).nativeElement;
      expect(container.getAttribute('data-type')).toBe('card');
    });
  });

  describe('Input Properties - Type', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should accept card type', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.detectChanges();

      expect(component.type()).toBe('card');
      const container = debugElement.query(By.css('.loading-stencil')).nativeElement;
      expect(container.getAttribute('data-type')).toBe('card');
    });

    it('should accept table type', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.detectChanges();

      expect(component.type()).toBe('table');
      const container = debugElement.query(By.css('.loading-stencil')).nativeElement;
      expect(container.getAttribute('data-type')).toBe('table');
    });

    it('should accept form type', () => {
      fixture.componentRef.setInput('type', 'form');
      fixture.detectChanges();

      expect(component.type()).toBe('form');
      const container = debugElement.query(By.css('.loading-stencil')).nativeElement;
      expect(container.getAttribute('data-type')).toBe('form');
    });

    it('should accept list type', () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.detectChanges();

      expect(component.type()).toBe('list');
      const container = debugElement.query(By.css('.loading-stencil')).nativeElement;
      expect(container.getAttribute('data-type')).toBe('list');
    });
  });

  describe('Input Properties - Count', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should accept count input', () => {
      fixture.componentRef.setInput('count', 5);
      fixture.detectChanges();

      expect(component.count()).toBe(5);
    });

    it('should render correct number of card items based on count', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.componentRef.setInput('count', 3);
      fixture.detectChanges();

      const cards = debugElement.queryAll(By.css('.stencil-card'));
      expect(cards.length).toBe(3);
    });

    it('should render correct number of form items based on count', () => {
      fixture.componentRef.setInput('type', 'form');
      fixture.componentRef.setInput('count', 4);
      fixture.detectChanges();

      const fields = debugElement.queryAll(By.css('.stencil-field'));
      expect(fields.length).toBe(4);
    });

    it('should render correct number of list items based on count', () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.componentRef.setInput('count', 5);
      fixture.detectChanges();

      const items = debugElement.queryAll(By.css('.stencil-list-item'));
      expect(items.length).toBe(5);
    });
  });

  describe('Input Properties - Rows', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should accept rows input', () => {
      fixture.componentRef.setInput('rows', 5);
      fixture.detectChanges();

      expect(component.rows()).toBe(5);
    });

    it('should render correct number of table rows based on rows input', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.componentRef.setInput('rows', 7);
      fixture.detectChanges();

      const rows = debugElement.queryAll(By.css('.stencil-table-row'));
      expect(rows.length).toBe(7);
    });

    it('should not affect non-table types', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      const cards = debugElement.queryAll(By.css('.stencil-card'));
      expect(cards.length).toBe(1); // Default count
    });
  });

  describe('Getter Methods', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
    });

    it('should return correct items array based on count', () => {
      fixture.componentRef.setInput('count', 5);
      fixture.detectChanges();

      expect(component.items).toHaveLength(5);
    });

    it('should return array with default count', () => {
      fixture.detectChanges();

      expect(component.items).toHaveLength(1);
    });

    it('should return correct tableRows array based on rows', () => {
      fixture.componentRef.setInput('rows', 8);
      fixture.detectChanges();

      expect(component.tableRows).toHaveLength(8);
    });

    it('should return array with default rows', () => {
      fixture.detectChanges();

      expect(component.tableRows).toHaveLength(3);
    });
  });

  describe('Card Type Rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should render card container', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.detectChanges();

      const cardContainer = debugElement.query(By.css('.stencil-cards'));
      expect(cardContainer).toBeTruthy();
    });

    it('should render stencil card with header', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.detectChanges();

      const header = debugElement.query(By.css('.stencil-header'));
      expect(header).toBeTruthy();
    });

    it('should render avatar in card', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.detectChanges();

      const avatar = debugElement.query(By.css('.avatar'));
      expect(avatar).toBeTruthy();
    });

    it('should render stencil lines in card header', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.detectChanges();

      const lines = debugElement.queryAll(By.css('.stencil-header .stencil-line'));
      expect(lines.length).toBeGreaterThan(0);
    });

    it('should render content in card', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.detectChanges();

      const content = debugElement.query(By.css('.stencil-content'));
      expect(content).toBeTruthy();
    });

    it('should render multiple content lines in card', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.detectChanges();

      const contentLines = debugElement.queryAll(By.css('.stencil-content .stencil-line'));
      expect(contentLines.length).toBe(3);
    });
  });

  describe('Table Type Rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should render table container', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.detectChanges();

      const tableContainer = debugElement.query(By.css('.stencil-table'));
      expect(tableContainer).toBeTruthy();
    });

    it('should render table header', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.detectChanges();

      const header = debugElement.query(By.css('.stencil-table-header'));
      expect(header).toBeTruthy();
    });

    it('should render 4 header columns', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.detectChanges();

      const headerCols = debugElement.queryAll(
        By.css('.stencil-table-header .stencil-line-header'),
      );
      expect(headerCols.length).toBe(4);
    });

    it('should render table rows', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.detectChanges();

      const rows = debugElement.queryAll(By.css('.stencil-table-row'));
      expect(rows.length).toBe(3); // Default rows
    });

    it('should render 4 columns in each row', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.detectChanges();

      const firstRow = debugElement.query(By.css('.stencil-table-row'));
      const cols = firstRow.queryAll(By.css('.stencil-line'));
      expect(cols.length).toBe(4);
    });
  });

  describe('Form Type Rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should render form container', () => {
      fixture.componentRef.setInput('type', 'form');
      fixture.detectChanges();

      const formContainer = debugElement.query(By.css('.stencil-form'));
      expect(formContainer).toBeTruthy();
    });

    it('should render form fields', () => {
      fixture.componentRef.setInput('type', 'form');
      fixture.detectChanges();

      const fields = debugElement.queryAll(By.css('.stencil-field'));
      expect(fields.length).toBe(1); // Default count
    });

    it('should render label line in form field', () => {
      fixture.componentRef.setInput('type', 'form');
      fixture.detectChanges();

      const label = debugElement.query(By.css('.stencil-line-label'));
      expect(label).toBeTruthy();
    });

    it('should render input line in form field', () => {
      fixture.componentRef.setInput('type', 'form');
      fixture.detectChanges();

      const input = debugElement.query(By.css('.stencil-line-input'));
      expect(input).toBeTruthy();
    });

    it('should render button at bottom of form', () => {
      fixture.componentRef.setInput('type', 'form');
      fixture.detectChanges();

      const button = debugElement.query(By.css('.stencil-button'));
      expect(button).toBeTruthy();
    });
  });

  describe('List Type Rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should render list container', () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.detectChanges();

      const listContainer = debugElement.query(By.css('.stencil-list'));
      expect(listContainer).toBeTruthy();
    });

    it('should render list items', () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.detectChanges();

      const items = debugElement.queryAll(By.css('.stencil-list-item'));
      expect(items.length).toBe(1); // Default count
    });

    it('should render small avatar in list item', () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.detectChanges();

      const avatar = debugElement.query(By.css('.avatar-small'));
      expect(avatar).toBeTruthy();
    });

    it('should render stencil lines in list item', () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.detectChanges();

      const lines = debugElement.queryAll(By.css('.stencil-list-item .stencil-line'));
      expect(lines.length).toBeGreaterThan(0);
    });

    it('should render title and short line in list item', () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.detectChanges();

      const title = debugElement.query(By.css('.stencil-line-title'));
      const short = debugElement.query(By.css('.stencil-line-short'));

      expect(title).toBeTruthy();
      expect(short).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should handle zero count', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.componentRef.setInput('count', 0);
      fixture.detectChanges();

      const cards = debugElement.queryAll(By.css('.stencil-card'));
      expect(cards.length).toBe(0);
    });

    it('should handle zero rows', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.componentRef.setInput('rows', 0);
      fixture.detectChanges();

      const rows = debugElement.queryAll(By.css('.stencil-table-row'));
      expect(rows.length).toBe(0);
    });

    it('should handle large count', () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.componentRef.setInput('count', 20);
      fixture.detectChanges();

      const items = debugElement.queryAll(By.css('.stencil-list-item'));
      expect(items.length).toBe(20);
    });

    it('should handle large rows', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.componentRef.setInput('rows', 15);
      fixture.detectChanges();

      const rows = debugElement.queryAll(By.css('.stencil-table-row'));
      expect(rows.length).toBe(15);
    });

    it('should update rendered items when count changes', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.componentRef.setInput('count', 2);
      fixture.detectChanges();

      let cards = debugElement.queryAll(By.css('.stencil-card'));
      expect(cards.length).toBe(2);

      fixture.componentRef.setInput('count', 5);
      fixture.detectChanges();

      cards = debugElement.queryAll(By.css('.stencil-card'));
      expect(cards.length).toBe(5);
    });
  });

  describe('Use Cases', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should work as loading placeholder for card grid', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.componentRef.setInput('count', 6);
      fixture.detectChanges();

      const cards = debugElement.queryAll(By.css('.stencil-card'));
      expect(cards.length).toBe(6);
      expect(debugElement.query(By.css('.stencil-cards'))).toBeTruthy();
    });

    it('should work as loading placeholder for data table', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      const header = debugElement.query(By.css('.stencil-table-header'));
      const rows = debugElement.queryAll(By.css('.stencil-table-row'));

      expect(header).toBeTruthy();
      expect(rows.length).toBe(10);
    });

    it('should work as loading placeholder for form with multiple fields', () => {
      fixture.componentRef.setInput('type', 'form');
      fixture.componentRef.setInput('count', 5);
      fixture.detectChanges();

      const fields = debugElement.queryAll(By.css('.stencil-field'));
      const button = debugElement.query(By.css('.stencil-button'));

      expect(fields.length).toBe(5);
      expect(button).toBeTruthy();
    });

    it('should work as loading placeholder for user list', () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.componentRef.setInput('count', 8);
      fixture.detectChanges();

      const items = debugElement.queryAll(By.css('.stencil-list-item'));
      const avatars = debugElement.queryAll(By.css('.avatar-small'));

      expect(items.length).toBe(8);
      expect(avatars.length).toBe(8);
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
    });

    it('should have no accessibility violations with card type', async () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.componentRef.setInput('count', 2);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with table type', async () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.componentRef.setInput('rows', 3);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with form type', async () => {
      fixture.componentRef.setInput('type', 'form');
      fixture.componentRef.setInput('count', 3);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with list type', async () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.componentRef.setInput('count', 4);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with zero items', async () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.componentRef.setInput('count', 0);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with many items', async () => {
      fixture.componentRef.setInput('type', 'list');
      fixture.componentRef.setInput('count', 10);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should meet WCAG 2.1 Level AA standards', async () => {
      fixture.componentRef.setInput('type', 'card');
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
      fixture.componentRef.setInput('type', 'table');
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
  });

  describe('Integration', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoadingStencil],
      }).compileComponents();

      fixture = TestBed.createComponent(LoadingStencil);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should switch between different types correctly', () => {
      fixture.componentRef.setInput('type', 'card');
      fixture.detectChanges();
      expect(debugElement.query(By.css('.stencil-cards'))).toBeTruthy();

      fixture.componentRef.setInput('type', 'table');
      fixture.detectChanges();
      expect(debugElement.query(By.css('.stencil-table'))).toBeTruthy();
      expect(debugElement.query(By.css('.stencil-cards'))).toBeFalsy();

      fixture.componentRef.setInput('type', 'form');
      fixture.detectChanges();
      expect(debugElement.query(By.css('.stencil-form'))).toBeTruthy();
      expect(debugElement.query(By.css('.stencil-table'))).toBeFalsy();

      fixture.componentRef.setInput('type', 'list');
      fixture.detectChanges();
      expect(debugElement.query(By.css('.stencil-list'))).toBeTruthy();
      expect(debugElement.query(By.css('.stencil-form'))).toBeFalsy();
    });

    it('should maintain data-type attribute when switching types', () => {
      const container = () => debugElement.query(By.css('.loading-stencil')).nativeElement;

      fixture.componentRef.setInput('type', 'card');
      fixture.detectChanges();
      expect(container().getAttribute('data-type')).toBe('card');

      fixture.componentRef.setInput('type', 'table');
      fixture.detectChanges();
      expect(container().getAttribute('data-type')).toBe('table');

      fixture.componentRef.setInput('type', 'form');
      fixture.detectChanges();
      expect(container().getAttribute('data-type')).toBe('form');
    });

    it('should handle all inputs together', () => {
      fixture.componentRef.setInput('type', 'table');
      fixture.componentRef.setInput('count', 5); // Should not affect table
      fixture.componentRef.setInput('rows', 8);
      fixture.detectChanges();

      const rows = debugElement.queryAll(By.css('.stencil-table-row'));
      expect(rows.length).toBe(8);
      expect(component.count()).toBe(5);
    });
  });
});
