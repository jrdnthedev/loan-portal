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
  });

  describe('Page Change Method', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should change to valid page within range', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;

      spyOn(component.pageChange, 'emit');

      component.changePage(3);

      expect(component.currentPage).toBe(3);
      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('should not change to page less than 1', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 1;

      spyOn(component.pageChange, 'emit');

      component.changePage(0);

      expect(component.currentPage).toBe(1);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should not change to page greater than total pages', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 3;

      spyOn(component.pageChange, 'emit');

      component.changePage(10);

      expect(component.currentPage).toBe(3);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should emit pageChange event for valid page changes', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 2;

      spyOn(component.pageChange, 'emit');

      component.changePage(4);

      expect(component.pageChange.emit).toHaveBeenCalledWith(4);
    });

    it('should not emit pageChange event for invalid page changes', () => {
      component.totalItems = 50;
      component.itemsPerPage = 10;
      component.currentPage = 5;

      spyOn(component.pageChange, 'emit');

      component.changePage(10);

      expect(component.pageChange.emit).not.toHaveBeenCalled();
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

  describe('Click Event Handling', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
      }).compileComponents();

      fixture = TestBed.createComponent(Pagination);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should handle Previous button click', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 2;
      fixture.detectChanges();

      spyOn(component, 'changePage');

      const previousButton = debugElement.query(By.css('button:first-child'));
      previousButton.nativeElement.click();

      expect(component.changePage).toHaveBeenCalledWith(1);
    });

    it('should handle Next button click', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 2;
      fixture.detectChanges();

      spyOn(component, 'changePage');

      const nextButton = debugElement.query(By.css('button:last-child'));
      nextButton.nativeElement.click();

      expect(component.changePage).toHaveBeenCalledWith(3);
    });

    it('should handle page number button click', () => {
      component.totalItems = 30;
      component.itemsPerPage = 10;
      component.currentPage = 1;
      fixture.detectChanges();

      spyOn(component, 'changePage');

      const pageButtons = debugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );
      pageButtons[1].nativeElement.click(); // Click page 2 button

      expect(component.changePage).toHaveBeenCalledWith(2);
    });
  });

  describe('With Projected Content', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostDebugElement: DebugElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Pagination],
        declarations: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostDebugElement = hostFixture.debugElement;
      hostFixture.detectChanges();
    });

    it('should project content correctly', () => {
      const projectedContent = hostDebugElement.query(By.css('p'));
      expect(projectedContent).toBeTruthy();
      expect(projectedContent.nativeElement.textContent).toBe('Total items: 100');
    });

    it('should emit page change events to parent', () => {
      expect(hostComponent.selectedPage).toBe(0);

      const pageButtons = hostDebugElement.queryAll(
        By.css('button:not(:first-child):not(:last-child)'),
      );
      pageButtons[1].nativeElement.click(); // Click page 2

      expect(hostComponent.selectedPage).toBe(2);
    });

    it('should use input properties from parent', () => {
      hostComponent.totalItems = 50;
      hostComponent.itemsPerPage = 5;
      hostComponent.currentPage = 3;
      hostFixture.detectChanges();

      const paginationComponent = hostDebugElement.query(
        By.directive(Pagination),
      ).componentInstance;
      expect(paginationComponent.totalItems).toBe(50);
      expect(paginationComponent.itemsPerPage).toBe(5);
      expect(paginationComponent.currentPage).toBe(3);
      expect(paginationComponent.totalPages).toBe(10);
    });
  });

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
  });
});
