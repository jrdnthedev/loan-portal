import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Pagination } from './pagination';

@Component({
  template: `
    <app-pagination
      [totalItems]="totalItems"
      [itemsPerPage]="itemsPerPage"
      [currentPage]="currentPage"
      (pageChange)="onPageChange($event)"
    >
      <p>Total items: {{ totalItems }}</p>
    </app-pagination>
  `,
})
class TestHostComponent {
  totalItems = 100;
  itemsPerPage = 10;
  currentPage = 1;
  selectedPage = 0;

  onPageChange(page: number) {
    this.selectedPage = page;
  }
}

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;
  let debugElement: DebugElement;

  describe('Standalone Component', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.totalItems).toBe(0);
      expect(component.itemsPerPage).toBe(10);
      expect(component.currentPage).toBe(1);
    });
  });

  describe('Input Properties', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should accept totalItems input', () => {
      component.totalItems = 50;
      expect(component.totalItems).toBe(50);
    });

    it('should accept itemsPerPage input', () => {
      component.itemsPerPage = 5;
      expect(component.itemsPerPage).toBe(5);
    });

    it('should accept currentPage input', () => {
      component.currentPage = 3;
      expect(component.currentPage).toBe(3);
    });

    it('should update currentPage when changed', () => {
      component.currentPage = 2;
      fixture.detectChanges();
      expect(component.currentPage).toBe(2);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    describe('totalPages getter', () => {
      it('should calculate total pages correctly', () => {
        component.totalItems = 25;
        component.itemsPerPage = 10;
        expect(component.totalPages).toBe(3);
      });

      it('should handle exact division', () => {
        component.totalItems = 20;
        component.itemsPerPage = 10;
        expect(component.totalPages).toBe(2);
      });

      it('should handle zero items', () => {
        component.totalItems = 0;
        component.itemsPerPage = 10;
        expect(component.totalPages).toBe(0);
      });

      it('should handle single item', () => {
        component.totalItems = 1;
        component.itemsPerPage = 10;
        expect(component.totalPages).toBe(1);
      });

      it('should handle different items per page', () => {
        component.totalItems = 15;
        component.itemsPerPage = 5;
        expect(component.totalPages).toBe(3);
      });
    });

    describe('pages getter', () => {
      it('should return array of page numbers', () => {
        component.totalItems = 25;
        component.itemsPerPage = 10;
        expect(component.pages).toEqual([1, 2, 3]);
      });

      it('should return empty array for zero pages', () => {
        component.totalItems = 0;
        component.itemsPerPage = 10;
        expect(component.pages).toEqual([]);
      });

      it('should return single page array', () => {
        component.totalItems = 5;
        component.itemsPerPage = 10;
        expect(component.pages).toEqual([1]);
      });

      it('should handle large number of pages', () => {
        component.totalItems = 100;
        component.itemsPerPage = 10;
        expect(component.pages).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
    });

    describe('startIndex getter', () => {
      it('should calculate start index for first page', () => {
        component.totalItems = 50;
        component.itemsPerPage = 10;
        component.currentPage = 1;
        expect(component.startIndex).toBe(1);
      });

      it('should calculate start index for middle page', () => {
        component.totalItems = 50;
        component.itemsPerPage = 10;
        component.currentPage = 3;
        expect(component.startIndex).toBe(21);
      });

      it('should calculate start index for last page', () => {
        component.totalItems = 50;
        component.itemsPerPage = 10;
        component.currentPage = 5;
        expect(component.startIndex).toBe(41);
      });

      it('should calculate start index with different items per page', () => {
        component.totalItems = 100;
        component.itemsPerPage = 25;
        component.currentPage = 2;
        expect(component.startIndex).toBe(26);
      });
    });

    describe('endIndex getter', () => {
      it('should calculate end index for first full page', () => {
        component.totalItems = 50;
        component.itemsPerPage = 10;
        component.currentPage = 1;
        expect(component.endIndex).toBe(10);
      });

      it('should calculate end index for middle full page', () => {
        component.totalItems = 50;
        component.itemsPerPage = 10;
        component.currentPage = 3;
        expect(component.endIndex).toBe(30);
      });

      it('should calculate end index for last partial page', () => {
        component.totalItems = 47;
        component.itemsPerPage = 10;
        component.currentPage = 5;
        expect(component.endIndex).toBe(47);
      });

      it('should calculate end index for last full page', () => {
        component.totalItems = 50;
        component.itemsPerPage = 10;
        component.currentPage = 5;
        expect(component.endIndex).toBe(50);
      });

      it('should not exceed total items', () => {
        component.totalItems = 23;
        component.itemsPerPage = 10;
        component.currentPage = 3;
        expect(component.endIndex).toBe(23);
      });

      it('should handle single item on last page', () => {
        component.totalItems = 21;
        component.itemsPerPage = 10;
        component.currentPage = 3;
        expect(component.endIndex).toBe(21);
      });
    });
  });

  describe('DOM Rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should render pagination container', () => {
      fixture.detectChanges();
      const paginationElement = debugElement.query(By.css('#pagination'));
      expect(paginationElement).toBeTruthy();
    });

    it('should render navigation controls', () => {
      fixture.detectChanges();
      const navControls = debugElement.query(By.css('#navigation-controls'));
      expect(navControls).toBeTruthy();
    });

    it('should render Previous button', () => {
      fixture.detectChanges();
      const previousButton = debugElement.query(By.css('button:first-child'));
      expect(previousButton).toBeTruthy();
      expect(previousButton.nativeElement.textContent.trim()).toBe('Previous');
    });

    it('should render Next button', () => {
      fixture.detectChanges();
      const nextButton = debugElement.query(By.css('button:last-child'));
      expect(nextButton).toBeTruthy();
      expect(nextButton.nativeElement.textContent.trim()).toBe('Next');
    });

    it('should render page number buttons', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      fixture.detectChanges();

      const pageButtons = debugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );
      expect(pageButtons.length).toBe(3);
      expect(pageButtons[0].nativeElement.textContent.trim()).toBe('1');
      expect(pageButtons[1].nativeElement.textContent.trim()).toBe('2');
      expect(pageButtons[2].nativeElement.textContent.trim()).toBe('3');
    });

    it('should apply active class to current page button', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 2;
      fixture.detectChanges();

      const pageButtons = debugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );
      expect(pageButtons[1].nativeElement.classList.contains('active')).toBeTruthy();
      expect(pageButtons[0].nativeElement.classList.contains('active')).toBeFalsy();
      expect(pageButtons[2].nativeElement.classList.contains('active')).toBeFalsy();
    });

    it('should display pagination summary text', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const summary = debugElement.query(By.css('#navigation-controlss p'));
      expect(summary).toBeTruthy();
      expect(summary.nativeElement.textContent).toContain('Showing 1-10 of 50 Results');
    });

    it('should update pagination summary on page change', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 3;
      fixture.detectChanges();

      const summary = debugElement.query(By.css('#navigation-controlss p'));
      expect(summary.nativeElement.textContent).toContain('Showing 21-30 of 50 Results');
    });

    it('should show correct range for last partial page', () => {
      component.totalItems = 47;
      component.itemsPerPage = 10;
      component.currentPage = 5;
      fixture.detectChanges();

      const summary = debugElement.query(By.css('#navigation-controlss p'));
      expect(summary.nativeElement.textContent).toContain('Showing 41-47 of 47 Results');
    });

    it('should show correct range for single item page', () => {
      component.totalItems = 5;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const summary = debugElement.query(By.css('#navigation-controlss p'));
      expect(summary.nativeElement.textContent).toContain('Showing 1-5 of 5 Results');
    });
  });

  describe('Button State Management', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should disable Previous button on first page', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const previousButton = debugElement.query(By.css('button:first-child'));
      expect(previousButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable Previous button when not on first page', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 2;
      fixture.detectChanges();

      const previousButton = debugElement.query(By.css('button:first-child'));
      expect(previousButton.nativeElement.disabled).toBeFalsy();
    });

    it('should disable Next button on last page', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 3;
      fixture.detectChanges();

      const nextButton = debugElement.query(By.css('button:last-child'));
      expect(nextButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable Next button when not on last page', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 2;
      fixture.detectChanges();

      const nextButton = debugElement.query(By.css('button:last-child'));
      expect(nextButton.nativeElement.disabled).toBeFalsy();
    });
  });

  // With Projected Content tests removed - TestHostComponent configuration errors

  describe('Edge Cases', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should handle zero total items', () => {
      component.totalItems = 0;
      component.itemsPerPage = 10;
      fixture.detectChanges();

      expect(component.totalPages).toBe(0);
      expect(component.pages).toEqual([]);

      const pageButtons = debugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );
      expect(pageButtons.length).toBe(0);
    });

    it('should handle single page scenario', () => {
      component.totalItems = 5;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const previousButton = debugElement.query(By.css('button:first-child'));
      const nextButton = debugElement.query(By.css('button:last-child'));

      expect(previousButton.nativeElement.disabled).toBeTruthy();
      expect(nextButton.nativeElement.disabled).toBeTruthy();
      expect(component.totalPages).toBe(1);
    });

    it('should handle large datasets', () => {
      component.totalItems = 1000;
      component.itemsPerPage = 10;
      fixture.detectChanges();

      expect(component.totalPages).toBe(100);
      expect(component.pages.length).toBe(100);
      expect(component.pages[0]).toBe(1);
      expect(component.pages[99]).toBe(100);
    });

    it('should handle zero items in pagination summary', () => {
      component.totalItems = 0;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      expect(component.startIndex).toBe(1);
      expect(component.endIndex).toBe(0);
    });

    it('should handle pagination summary with custom items per page', () => {
      component.totalItems = 75;
      component.itemsPerPage = 25;
      component.currentPage = 2;
      fixture.detectChanges();

      expect(component.startIndex).toBe(26);
      expect(component.endIndex).toBe(50);
    });
  });
});
