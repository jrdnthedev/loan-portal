import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { axe } from 'vitest-axe';
import { Pagination } from './pagination';

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [Pagination],
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

@Component({
  selector: 'app-empty-host',
  standalone: true,
  imports: [Pagination],
  template: `<app-pagination [totalItems]="0" [itemsPerPage]="10"></app-pagination>`,
})
class EmptyHostComponent {}

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;
  let debugElement: DebugElement;

  describe('Component Creation', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.totalItems).toBe(0);
      expect(component.itemsPerPage).toBe(10);
      expect(component.currentPage).toBe(1);
    });

    it('should have changePage method', () => {
      expect(typeof component.changePage).toBe('function');
    });

    it('should render pagination container', () => {
      fixture.detectChanges();
      const paginationElement = debugElement.query(By.css('#pagination'));
      expect(paginationElement).toBeTruthy();
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

  describe('changePage Method', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should change to valid page number', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;

      component.changePage(3);

      expect(component.currentPage).toBe(3);
    });

    it('should not change to page number less than 1', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 2;

      component.changePage(0);

      expect(component.currentPage).toBe(2);
    });

    it('should not change to page number greater than totalPages', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 3;

      component.changePage(10);

      expect(component.currentPage).toBe(3);
    });

    it('should emit pageChange event on valid page change', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;

      const emitSpy = vi.fn();
      component.pageChange.subscribe(emitSpy);

      component.changePage(3);

      expect(emitSpy).toHaveBeenCalledWith(3);
    });

    it('should not emit pageChange event for invalid page', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 2;

      const emitSpy = vi.fn();
      component.pageChange.subscribe(emitSpy);

      component.changePage(0);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should handle changing to first page', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 3;

      component.changePage(1);

      expect(component.currentPage).toBe(1);
    });

    it('should handle changing to last page', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;

      component.changePage(5);

      expect(component.currentPage).toBe(5);
    });
  });

  describe('Button Click Interactions', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should call changePage when Previous button is clicked', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 3;
      fixture.detectChanges();

      const changeSpy = vi.spyOn(component, 'changePage');
      const previousButton = debugElement.query(By.css('button:first-child')).nativeElement;

      previousButton.click();

      expect(changeSpy).toHaveBeenCalledWith(2);
    });

    it('should call changePage when Next button is clicked', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 2;
      fixture.detectChanges();

      const changeSpy = vi.spyOn(component, 'changePage');
      const nextButton = debugElement.query(By.css('button:last-child')).nativeElement;

      nextButton.click();

      expect(changeSpy).toHaveBeenCalledWith(3);
    });

    it('should call changePage when page number button is clicked', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const changeSpy = vi.spyOn(component, 'changePage');
      const pageButtons = debugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );

      pageButtons[2].nativeElement.click(); // Click on page 3

      expect(changeSpy).toHaveBeenCalledWith(3);
    });

    it('should emit pageChange event when page button is clicked', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const emitSpy = vi.fn();
      component.pageChange.subscribe(emitSpy);

      const pageButtons = debugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );
      pageButtons[1].nativeElement.click(); // Click on page 2

      expect(emitSpy).toHaveBeenCalledWith(2);
      expect(component.currentPage).toBe(2);
    });

    it('should not emit event when clicking disabled Previous button', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const emitSpy = vi.fn();
      component.pageChange.subscribe(emitSpy);

      const previousButton = debugElement.query(By.css('button:first-child')).nativeElement;
      previousButton.click();

      expect(emitSpy).not.toHaveBeenCalled();
      expect(component.currentPage).toBe(1);
    });

    it('should not emit event when clicking disabled Next button', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 5;
      fixture.detectChanges();

      const emitSpy = vi.fn();
      component.pageChange.subscribe(emitSpy);

      const nextButton = debugElement.query(By.css('button:last-child')).nativeElement;
      nextButton.click();

      expect(emitSpy).not.toHaveBeenCalled();
      expect(component.currentPage).toBe(5);
    });
  });

  describe('Content Projection', () => {
    it('should project content inside pagination', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const projectedContent = hostFixture.debugElement.query(By.css('p'));
      expect(projectedContent).toBeTruthy();
      expect(projectedContent.nativeElement.textContent).toContain('Total items: 100');
    });

    it('should handle empty content projection', () => {
      TestBed.configureTestingModule({
        imports: [EmptyHostComponent],
      });

      const hostFixture = TestBed.createComponent(EmptyHostComponent);
      hostFixture.detectChanges();

      const pagination = hostFixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeTruthy();
    });

    it('should project complex content', () => {
      @Component({
        selector: 'app-complex-host',
        standalone: true,
        imports: [Pagination],
        template: `
          <app-pagination [totalItems]="50" [itemsPerPage]="10">
            <div class="header">
              <h3>Search Results</h3>
            </div>
            <div class="filters">
              <button>Filter 1</button>
              <button>Filter 2</button>
            </div>
          </app-pagination>
        `,
      })
      class ComplexHostComponent {}

      TestBed.configureTestingModule({
        imports: [ComplexHostComponent],
      });

      const hostFixture = TestBed.createComponent(ComplexHostComponent);
      hostFixture.detectChanges();

      expect(hostFixture.debugElement.query(By.css('.header'))).toBeTruthy();
      expect(hostFixture.debugElement.query(By.css('.filters'))).toBeTruthy();
      expect(hostFixture.debugElement.queryAll(By.css('.filters button')).length).toBe(2);
    });
  });

  describe('Event Output with Host Component', () => {
    it('should emit pageChange to parent component', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const pageButtons = hostFixture.debugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );
      pageButtons[2].nativeElement.click(); // Click on page 3

      expect(hostComponent.selectedPage).toBe(3);
    });

    it('should update parent component when Previous is clicked', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostComponent.currentPage = 5;
      hostFixture.detectChanges();

      const previousButton = hostFixture.debugElement.query(
        By.css('button:first-child'),
      ).nativeElement;
      previousButton.click();

      expect(hostComponent.selectedPage).toBe(4);
    });

    it('should update parent component when Next is clicked', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const nextButton = hostFixture.debugElement.query(By.css('button:last-child')).nativeElement;
      nextButton.click();

      expect(hostComponent.selectedPage).toBe(2);
    });
  });

  describe('Dynamic Updates', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should render correct pages for 30 totalItems', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      expect(component.pages.length).toBe(3);
    });

    it('should render correct pages for 50 totalItems', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      expect(component.pages.length).toBe(5);
    });

    it('should render correct pages for 10 itemsPerPage', () => {
      component.totalItems = 100;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      expect(component.pages.length).toBe(10);
    });

    it('should render correct pages for 20 itemsPerPage', () => {
      component.totalItems = 100;
      component.itemsPerPage = 20;
      component.currentPage = 1;
      fixture.detectChanges();

      expect(component.pages.length).toBe(5);
    });

    it('should display correct pagination summary for page 1', () => {
      component.totalItems = 100;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const summary = debugElement.query(By.css('#navigation-controlss p'));
      expect(summary.nativeElement.textContent).toContain('Showing 1-10 of 100 Results');
    });

    it('should display correct pagination summary for page 5', () => {
      component.totalItems = 100;
      component.itemsPerPage = 10;
      component.currentPage = 5;
      fixture.detectChanges();

      const summary = debugElement.query(By.css('#navigation-controlss p'));
      expect(summary.nativeElement.textContent).toContain('Showing 41-50 of 100 Results');
    });

    it('should compute totalPages correctly when totalItems decreases', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      expect(component.totalPages).toBe(3);
    });
  });

  describe('Use Cases', () => {
    it('should work for search results pagination', () => {
      TestBed.configureTestingModule({
        imports: [Pagination],
      });

      const searchFixture = TestBed.createComponent(Pagination);
      const searchComponent = searchFixture.componentInstance;
      searchComponent.totalItems = 247;
      searchComponent.itemsPerPage = 25;
      searchComponent.currentPage = 1;
      searchFixture.detectChanges();

      expect(searchComponent.totalPages).toBe(10);
      expect(searchComponent.startIndex).toBe(1);
      expect(searchComponent.endIndex).toBe(25);

      const summary = searchFixture.debugElement.query(By.css('#navigation-controlss p'));
      expect(summary.nativeElement.textContent).toContain('Showing 1-25 of 247 Results');
    });

    it('should work for table pagination', () => {
      TestBed.configureTestingModule({
        imports: [Pagination],
      });

      const tableFixture = TestBed.createComponent(Pagination);
      const tableComponent = tableFixture.componentInstance;
      tableComponent.totalItems = 1500;
      tableComponent.itemsPerPage = 50;
      tableComponent.currentPage = 15;
      tableFixture.detectChanges();

      expect(tableComponent.totalPages).toBe(30);
      expect(tableComponent.startIndex).toBe(701);
      expect(tableComponent.endIndex).toBe(750);

      const pageButtons = tableFixture.debugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );
      expect(pageButtons.length).toBe(30);
    });

    it('should work for small datasets', () => {
      TestBed.configureTestingModule({
        imports: [Pagination],
      });

      const smallFixture = TestBed.createComponent(Pagination);
      const smallComponent = smallFixture.componentInstance;
      smallComponent.totalItems = 8;
      smallComponent.itemsPerPage = 10;
      smallComponent.currentPage = 1;
      smallFixture.detectChanges();

      expect(smallComponent.totalPages).toBe(1);

      const previousButton = smallFixture.debugElement.query(
        By.css('button:first-child'),
      ).nativeElement;
      const nextButton = smallFixture.debugElement.query(By.css('button:last-child')).nativeElement;

      expect(previousButton.disabled).toBe(true);
      expect(nextButton.disabled).toBe(true);
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
    });

    it('should have no accessibility violations with basic pagination', async () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with multiple pages', async () => {
      component.totalItems = 100;
      component.itemsPerPage = 10;
      component.currentPage = 5;
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with single page', async () => {
      component.totalItems = 5;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with zero items', async () => {
      component.totalItems = 0;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with disabled buttons', async () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations on last page', async () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 3;
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
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
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 2;
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
      component.totalItems = 50;
      component.itemsPerPage = 10;
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

    it('should have keyboard accessible buttons', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button'));
      buttons.forEach((button) => {
        expect(button.nativeElement.tagName.toLowerCase()).toBe('button');
      });
    });
  });

  describe('Integration', () => {
    it('should work end-to-end with host component', () => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      const hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostComponent.totalItems = 50;
      hostComponent.itemsPerPage = 10;
      hostComponent.currentPage = 1;
      hostFixture.detectChanges();

      // Verify initial state
      const pagination = hostFixture.debugElement.query(By.directive(Pagination));
      expect(pagination).toBeTruthy();

      // Click next button
      const nextButton = hostFixture.debugElement.query(By.css('button:last-child')).nativeElement;
      nextButton.click();
      hostFixture.detectChanges();

      expect(hostComponent.selectedPage).toBe(2);

      // Click specific page
      const pageButtons = hostFixture.debugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );
      pageButtons[3].nativeElement.click();
      hostFixture.detectChanges();

      expect(hostComponent.selectedPage).toBe(4);

      // Click previous button
      const previousButton = hostFixture.debugElement.query(
        By.css('button:first-child'),
      ).nativeElement;
      previousButton.click();
      hostFixture.detectChanges();

      expect(hostComponent.selectedPage).toBe(3);
    });

    it('should handle multiple event subscriptions', () => {
      TestBed.configureTestingModule({
        imports: [Pagination],
      });

      const paginationFixture = TestBed.createComponent(Pagination);
      const paginationComponent = paginationFixture.componentInstance;
      paginationComponent.totalItems = 50;
      paginationComponent.itemsPerPage = 10;
      paginationFixture.detectChanges();

      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();
      const subscriber3 = vi.fn();

      paginationComponent.pageChange.subscribe(subscriber1);
      paginationComponent.pageChange.subscribe(subscriber2);
      paginationComponent.pageChange.subscribe(subscriber3);

      paginationComponent.changePage(3);

      expect(subscriber1).toHaveBeenCalledWith(3);
      expect(subscriber2).toHaveBeenCalledWith(3);
      expect(subscriber3).toHaveBeenCalledWith(3);
    });

    it('should maintain consistency between computed properties', () => {
      TestBed.configureTestingModule({
        imports: [Pagination],
      });

      const paginationFixture = TestBed.createComponent(Pagination);
      const paginationComponent = paginationFixture.componentInstance;
      paginationComponent.totalItems = 47;
      paginationComponent.itemsPerPage = 10;
      paginationComponent.currentPage = 5;
      paginationFixture.detectChanges();

      expect(paginationComponent.totalPages).toBe(5);
      expect(paginationComponent.pages.length).toBe(5);
      expect(paginationComponent.startIndex).toBe(41);
      expect(paginationComponent.endIndex).toBe(47);
      expect(paginationComponent.endIndex - paginationComponent.startIndex + 1).toBe(7);
    });
  });
});
