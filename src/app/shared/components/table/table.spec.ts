import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';

import { Table, TableColumn } from './table';

interface TestData {
  id: number;
  name: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [Table],
  template: `<app-table [data]="tableData" [columns]="tableColumns"></app-table>`,
})
class TestHostComponent {
  tableData: TestData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  ];

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'status', label: 'Status' },
  ];
}

@Component({
  selector: 'app-auto-host',
  standalone: true,
  imports: [Table],
  template: `<app-table [data]="simpleData"></app-table>`,
})
class AutoGenerateHostComponent {
  simpleData = [
    { firstName: 'John', lastName: 'Doe', age: 30 },
    { firstName: 'Jane', lastName: 'Smith', age: 25 },
  ];
}

@Component({
  selector: 'app-selectable-host',
  standalone: true,
  imports: [Table],
  template: `<app-table
    [data]="tableData"
    [columns]="tableColumns"
    [selectable]="true"
    (selectionChange)="onSelectionChange($event)"
  ></app-table>`,
})
class SelectableHostComponent {
  tableData: TestData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Bob Brown', email: 'bob@example.com', status: 'active' },
  ];

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
  ];

  selectedRows = new Set<TestData>();
  onSelectionChange = vi.fn((selection: Set<TestData>) => {
    this.selectedRows = selection;
  });
}

describe('Table', () => {
  let component: Table<any>;
  let fixture: ComponentFixture<Table<any>>;
  let debugElement: DebugElement;

  describe('Standalone Component', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.data()).toEqual([]);
      expect(component.columns()).toEqual([]);
      expect(component.selectable()).toBe(false);
    });
  });

  describe('Input Properties', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should accept data input', () => {
      const testData = [{ name: 'Test', value: 123 }];
      fixture.componentRef.setInput('data', testData);
      expect(component.data()).toBe(testData);
    });

    it('should accept columns input', () => {
      const testColumns: TableColumn[] = [
        { key: 'name', label: 'Name' },
        { key: 'value', label: 'Value' },
      ];
      fixture.componentRef.setInput('columns', testColumns);
      expect(component.columns()).toBe(testColumns);
    });

    it('should accept selectable input', () => {
      fixture.componentRef.setInput('selectable', true);
      expect(component.selectable()).toBe(true);
    });
  });

  describe('Headers Generation', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should generate headers from columns when provided', () => {
      fixture.componentRef.setInput('columns', [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
      ]);

      expect(component.headers).toEqual(['id', 'name']);
    });

    it('should auto-generate headers from data when no columns provided', () => {
      fixture.componentRef.setInput('data', [{ firstName: 'John', lastName: 'Doe' }]);
      fixture.componentRef.setInput('columns', []);

      expect(component.headers).toEqual(['firstName', 'lastName']);
    });

    it('should return empty array when no data and no columns', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('columns', []);

      expect(component.headers).toEqual([]);
    });

    it('should prioritize columns over auto-generation', () => {
      fixture.componentRef.setInput('data', [{ firstName: 'John', lastName: 'Doe', age: 30 }]);
      fixture.componentRef.setInput('columns', [{ key: 'firstName', label: 'First Name' }]);

      expect(component.headers).toEqual(['firstName']);
    });
  });

  describe('Header Label Generation', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should return column label when column is defined', () => {
      fixture.componentRef.setInput('columns', [
        { key: 'firstName', label: 'First Name' },
        { key: 'email', label: 'Email Address' },
      ]);

      expect(component.getHeaderLabel('firstName')).toBe('First Name');
      expect(component.getHeaderLabel('email')).toBe('Email Address');
    });

    it('should return key as label when column is not found', () => {
      fixture.componentRef.setInput('columns', [{ key: 'name', label: 'Full Name' }]);

      expect(component.getHeaderLabel('age')).toBe('age');
    });

    it('should return key as label when no columns are defined', () => {
      fixture.componentRef.setInput('columns', []);

      expect(component.getHeaderLabel('firstName')).toBe('firstName');
    });
  });

  describe('Value Retrieval', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should retrieve value from row object', () => {
      const row = { name: 'John', age: 30, status: 'active' };

      expect(component.getValue(row, 'name')).toBe('John');
      expect(component.getValue(row, 'age')).toBe(30);
      expect(component.getValue(row, 'status')).toBe('active');
    });

    it('should return undefined for non-existent keys', () => {
      const row = { name: 'John' };

      expect(component.getValue(row, 'age')).toBeUndefined();
    });

    it('should handle null and undefined values', () => {
      const row = { name: null, age: undefined };

      expect(component.getValue(row, 'name')).toBeNull();
      expect(component.getValue(row, 'age')).toBeUndefined();
    });
  });

  describe('Row Selection', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should have no rows selected initially', () => {
      const data = [{ name: 'John' }, { name: 'Jane' }];
      fixture.componentRef.setInput('data', data);

      expect(component.isRowSelected(data[0])).toBe(false);
      expect(component.isRowSelected(data[1])).toBe(false);
    });

    it('should select a row via toggleRow', () => {
      const data = [{ name: 'John' }, { name: 'Jane' }];
      fixture.componentRef.setInput('data', data);

      component.toggleRow(data[0]);

      expect(component.isRowSelected(data[0])).toBe(true);
      expect(component.isRowSelected(data[1])).toBe(false);
    });

    it('should deselect a row when toggled again', () => {
      const data = [{ name: 'John' }];
      fixture.componentRef.setInput('data', data);

      component.toggleRow(data[0]);
      expect(component.isRowSelected(data[0])).toBe(true);

      component.toggleRow(data[0]);
      expect(component.isRowSelected(data[0])).toBe(false);
    });

    it('should select multiple rows independently', () => {
      const data = [{ name: 'John' }, { name: 'Jane' }, { name: 'Bob' }];
      fixture.componentRef.setInput('data', data);

      component.toggleRow(data[0]);
      component.toggleRow(data[2]);

      expect(component.isRowSelected(data[0])).toBe(true);
      expect(component.isRowSelected(data[1])).toBe(false);
      expect(component.isRowSelected(data[2])).toBe(true);
    });

    it('should report isAllSelected false when only some rows are selected', () => {
      const data = [{ name: 'John' }, { name: 'Jane' }];
      fixture.componentRef.setInput('data', data);

      component.toggleRow(data[0]);

      expect(component.isAllSelected()).toBe(false);
    });

    it('should report isAllSelected true when all rows are selected', () => {
      const data = [{ name: 'John' }, { name: 'Jane' }];
      fixture.componentRef.setInput('data', data);

      component.toggleRow(data[0]);
      component.toggleRow(data[1]);

      expect(component.isAllSelected()).toBe(true);
    });

    it('should report isAllSelected false with empty data', () => {
      fixture.componentRef.setInput('data', []);

      expect(component.isAllSelected()).toBe(false);
    });
  });

  describe('Toggle All', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should select all rows when none are selected', () => {
      const data = [{ name: 'John' }, { name: 'Jane' }, { name: 'Bob' }];
      fixture.componentRef.setInput('data', data);

      component.toggleAll();

      expect(component.isAllSelected()).toBe(true);
      expect(component.isRowSelected(data[0])).toBe(true);
      expect(component.isRowSelected(data[1])).toBe(true);
      expect(component.isRowSelected(data[2])).toBe(true);
    });

    it('should deselect all rows when all are selected', () => {
      const data = [{ name: 'John' }, { name: 'Jane' }];
      fixture.componentRef.setInput('data', data);

      component.toggleAll(); // select all
      component.toggleAll(); // deselect all

      expect(component.isAllSelected()).toBe(false);
      expect(component.isRowSelected(data[0])).toBe(false);
      expect(component.isRowSelected(data[1])).toBe(false);
    });

    it('should select all when only some rows are selected', () => {
      const data = [{ name: 'John' }, { name: 'Jane' }, { name: 'Bob' }];
      fixture.componentRef.setInput('data', data);

      component.toggleRow(data[0]); // select one
      component.toggleAll(); // should select all since not all selected

      expect(component.isAllSelected()).toBe(true);
    });
  });

  describe('selectionChange Output', () => {
    it('should emit selection when a row is toggled via host', () => {
      TestBed.configureTestingModule({ imports: [SelectableHostComponent] });
      const hostFixture = TestBed.createComponent(SelectableHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const rowCheckboxes = hostFixture.debugElement.queryAll(
        By.css('tbody input[type="checkbox"]'),
      );
      rowCheckboxes[0].nativeElement.click();
      hostFixture.detectChanges();

      expect(hostComponent.onSelectionChange).toHaveBeenCalledTimes(1);
      const emitted = hostComponent.onSelectionChange.mock.calls[0][0] as Set<TestData>;
      expect(emitted.size).toBe(1);
    });

    it('should emit selection when select-all is clicked via host', () => {
      TestBed.configureTestingModule({ imports: [SelectableHostComponent] });
      const hostFixture = TestBed.createComponent(SelectableHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const selectAllCheckbox = hostFixture.debugElement.query(By.css('#select-all-checkbox'));
      selectAllCheckbox.nativeElement.click();
      hostFixture.detectChanges();

      expect(hostComponent.onSelectionChange).toHaveBeenCalledTimes(1);
      const emitted = hostComponent.onSelectionChange.mock.calls[0][0] as Set<TestData>;
      expect(emitted.size).toBe(3);
    });

    it('should emit empty set when all are deselected via select-all toggle', () => {
      TestBed.configureTestingModule({ imports: [SelectableHostComponent] });
      const hostFixture = TestBed.createComponent(SelectableHostComponent);
      const hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const selectAllCheckbox = hostFixture.debugElement.query(By.css('#select-all-checkbox'));
      selectAllCheckbox.nativeElement.click(); // select all
      hostFixture.detectChanges();
      selectAllCheckbox.nativeElement.click(); // deselect all
      hostFixture.detectChanges();

      expect(hostComponent.onSelectionChange).toHaveBeenCalledTimes(2);
      const emitted = hostComponent.onSelectionChange.mock.calls[1][0] as Set<TestData>;
      expect(emitted.size).toBe(0);
    });
  });

  describe('DOM Rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should render table wrapper', () => {
      fixture.detectChanges();
      const wrapper = debugElement.query(By.css('#table-wrapper'));
      expect(wrapper).toBeTruthy();
    });

    it('should render table element', () => {
      fixture.detectChanges();
      const table = debugElement.query(By.css('table'));
      expect(table).toBeTruthy();
    });

    it('should render thead and tbody', () => {
      fixture.detectChanges();
      const thead = debugElement.query(By.css('thead'));
      const tbody = debugElement.query(By.css('tbody'));

      expect(thead).toBeTruthy();
      expect(tbody).toBeTruthy();
    });

    it('should render header cells when headers are present', () => {
      fixture.componentRef.setInput('data', [{ name: 'John', age: 30 }]);
      fixture.detectChanges();

      const headerCells = debugElement.queryAll(By.css('th'));
      expect(headerCells.length).toBe(2);
      expect(headerCells[0].nativeElement.textContent.trim()).toBe('name');
      expect(headerCells[1].nativeElement.textContent.trim()).toBe('age');
    });

    it('should render data rows', () => {
      fixture.componentRef.setInput('data', [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ]);
      fixture.detectChanges();

      const dataRows = debugElement.queryAll(By.css('tbody tr'));
      expect(dataRows.length).toBe(2);
    });

    it('should render data cells with correct values', () => {
      fixture.componentRef.setInput('data', [{ name: 'John', age: 30 }]);
      fixture.detectChanges();

      const dataCells = debugElement.queryAll(By.css('tbody td'));
      expect(dataCells.length).toBe(2);
      expect(dataCells[0].nativeElement.textContent.trim()).toBe('John');
      expect(dataCells[1].nativeElement.textContent.trim()).toBe('30');
    });

    it('should set data-label attributes on cells', () => {
      fixture.componentRef.setInput('data', [{ name: 'John', age: 30 }]);
      fixture.componentRef.setInput('columns', [
        { key: 'name', label: 'Full Name' },
        { key: 'age', label: 'Age' },
      ]);
      fixture.detectChanges();

      const dataCells = debugElement.queryAll(By.css('tbody td'));
      expect(dataCells[0].nativeElement.getAttribute('data-label')).toBe('Full Name');
      expect(dataCells[1].nativeElement.getAttribute('data-label')).toBe('Age');
    });

    it('should use th scope="col" for all header cells', () => {
      fixture.componentRef.setInput('data', [{ name: 'John', age: 30 }]);
      fixture.detectChanges();

      const headerCells = debugElement.queryAll(By.css('th'));
      headerCells.forEach((cell) => {
        expect(cell.nativeElement.getAttribute('scope')).toBe('col');
      });
    });
  });

  describe('Selectable DOM Rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should not render checkboxes when selectable is false', () => {
      fixture.componentRef.setInput('data', [{ name: 'John' }]);
      fixture.componentRef.setInput('selectable', false);
      fixture.detectChanges();

      const checkboxes = debugElement.queryAll(By.css('input[type="checkbox"]'));
      expect(checkboxes.length).toBe(0);
    });

    it('should render select-all checkbox in header when selectable', () => {
      fixture.componentRef.setInput('data', [{ name: 'John' }]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const selectAll = debugElement.query(By.css('#select-all-checkbox'));
      expect(selectAll).toBeTruthy();
    });

    it('should render row checkboxes when selectable', () => {
      fixture.componentRef.setInput('data', [{ name: 'John' }, { name: 'Jane' }]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const rowCheckboxes = debugElement.queryAll(By.css('tbody input[type="checkbox"]'));
      expect(rowCheckboxes.length).toBe(2);
    });

    it('should have unique ids on row checkboxes', () => {
      fixture.componentRef.setInput('data', [{ name: 'John' }, { name: 'Jane' }]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const rowCheckboxes = debugElement.queryAll(By.css('tbody input[type="checkbox"]'));
      expect(rowCheckboxes[0].nativeElement.id).toBe('row-checkbox-0');
      expect(rowCheckboxes[1].nativeElement.id).toBe('row-checkbox-1');
    });

    it('should have aria-labels on row checkboxes', () => {
      fixture.componentRef.setInput('data', [{ name: 'John' }, { name: 'Jane' }]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const rowCheckboxes = debugElement.queryAll(By.css('tbody input[type="checkbox"]'));
      expect(rowCheckboxes[0].nativeElement.getAttribute('aria-label')).toBe('Select row 1');
      expect(rowCheckboxes[1].nativeElement.getAttribute('aria-label')).toBe('Select row 2');
    });

    it('should have sr-only labels for all checkboxes', () => {
      fixture.componentRef.setInput('data', [{ name: 'John' }]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const srLabels = debugElement.queryAll(By.css('.sr-only'));
      expect(srLabels.length).toBeGreaterThanOrEqual(2); // select-all + row label
    });

    it('should add extra th column for checkboxes when selectable', () => {
      fixture.componentRef.setInput('data', [{ name: 'John' }]);
      fixture.componentRef.setInput('columns', [{ key: 'name', label: 'Name' }]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const headerCells = debugElement.queryAll(By.css('th'));
      // 1 for checkbox column + 1 for 'Name'
      expect(headerCells.length).toBe(2);
    });

    it('should add extra td column for checkboxes in each row', () => {
      fixture.componentRef.setInput('data', [{ name: 'John' }]);
      fixture.componentRef.setInput('columns', [{ key: 'name', label: 'Name' }]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const dataCells = debugElement.queryAll(By.css('tbody td'));
      // 1 for checkbox + 1 for 'Name'
      expect(dataCells.length).toBe(2);
    });

    it('should check row checkbox when row is selected', () => {
      const data = [{ name: 'John' }];
      fixture.componentRef.setInput('data', data);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      component.toggleRow(data[0]);
      fixture.detectChanges();

      const rowCheckbox = debugElement.query(By.css('tbody input[type="checkbox"]'));
      expect(rowCheckbox.nativeElement.checked).toBe(true);
    });

    it('should check select-all checkbox when all rows are selected', () => {
      const data = [{ name: 'John' }, { name: 'Jane' }];
      fixture.componentRef.setInput('data', data);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      component.toggleAll();
      fixture.detectChanges();

      const selectAll = debugElement.query(By.css('#select-all-checkbox'));
      expect(selectAll.nativeElement.checked).toBe(true);
    });
  });

  describe('With Columns Configuration (Host)', () => {
    it('should render column labels from host', () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const headerCells = hostFixture.debugElement.queryAll(By.css('th'));
      expect(headerCells.length).toBe(4);
      expect(headerCells[0].nativeElement.textContent.trim()).toBe('ID');
      expect(headerCells[1].nativeElement.textContent.trim()).toBe('Full Name');
      expect(headerCells[2].nativeElement.textContent.trim()).toBe('Email Address');
      expect(headerCells[3].nativeElement.textContent.trim()).toBe('Status');
    });

    it('should render data rows from host', () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const dataRows = hostFixture.debugElement.queryAll(By.css('tbody tr'));
      expect(dataRows.length).toBe(2);
    });

    it('should render correct cell values from host', () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const firstRowCells = hostFixture.debugElement.queryAll(By.css('tbody tr:first-child td'));
      expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('1');
      expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('John Doe');
      expect(firstRowCells[2].nativeElement.textContent.trim()).toBe('john@example.com');
      expect(firstRowCells[3].nativeElement.textContent.trim()).toBe('active');
    });
  });

  describe('Auto-Generated Headers (Host)', () => {
    it('should auto-generate headers from data keys', () => {
      TestBed.configureTestingModule({ imports: [AutoGenerateHostComponent] });
      const hostFixture = TestBed.createComponent(AutoGenerateHostComponent);
      hostFixture.detectChanges();

      const headerCells = hostFixture.debugElement.queryAll(By.css('th'));
      expect(headerCells.length).toBe(3);
      expect(headerCells[0].nativeElement.textContent.trim()).toBe('firstName');
      expect(headerCells[1].nativeElement.textContent.trim()).toBe('lastName');
      expect(headerCells[2].nativeElement.textContent.trim()).toBe('age');
    });

    it('should render rows with auto-generated headers', () => {
      TestBed.configureTestingModule({ imports: [AutoGenerateHostComponent] });
      const hostFixture = TestBed.createComponent(AutoGenerateHostComponent);
      hostFixture.detectChanges();

      const dataRows = hostFixture.debugElement.queryAll(By.css('tbody tr'));
      expect(dataRows.length).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should handle empty data array', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('columns', [{ key: 'name', label: 'Name' }]);
      fixture.detectChanges();

      const headerCells = debugElement.queryAll(By.css('th'));
      const dataRows = debugElement.queryAll(By.css('tbody tr'));

      expect(headerCells.length).toBe(1);
      expect(dataRows.length).toBe(0);
    });

    it('should handle data with missing properties', () => {
      fixture.componentRef.setInput('data', [{ name: 'John' }]);
      fixture.componentRef.setInput('columns', [
        { key: 'name', label: 'Name' },
        { key: 'age', label: 'Age' },
      ]);
      fixture.detectChanges();

      const dataCells = debugElement.queryAll(By.css('tbody td'));
      expect(dataCells[0].nativeElement.textContent.trim()).toBe('John');
      expect(dataCells[1].nativeElement.textContent.trim()).toBe('');
    });

    it('should handle data with null and undefined values', () => {
      fixture.componentRef.setInput('data', [{ name: null, age: undefined, status: 'active' }]);
      fixture.detectChanges();

      const dataCells = debugElement.queryAll(By.css('tbody td'));
      expect(dataCells[0].nativeElement.textContent.trim()).toBe('');
      expect(dataCells[1].nativeElement.textContent.trim()).toBe('');
      expect(dataCells[2].nativeElement.textContent.trim()).toBe('active');
    });

    it('should handle inconsistent data structures', () => {
      fixture.componentRef.setInput('data', [
        { name: 'John', age: 30 },
        { name: 'Jane', email: 'jane@example.com' },
      ]);
      fixture.detectChanges();

      const headerCells = debugElement.queryAll(By.css('th'));
      expect(headerCells.length).toBe(2);
      expect(headerCells[0].nativeElement.textContent.trim()).toBe('name');
      expect(headerCells[1].nativeElement.textContent.trim()).toBe('age');
    });
  });

  describe('TypeScript Generic Support', () => {
    interface User {
      id: number;
      username: string;
      email: string;
    }

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();
    });

    it('should work with strongly typed data', () => {
      const userFixture = TestBed.createComponent(Table<User>);
      const userComponent = userFixture.componentInstance;

      const userData: User[] = [
        { id: 1, username: 'johndoe', email: 'john@example.com' },
        { id: 2, username: 'janedoe', email: 'jane@example.com' },
      ];

      userFixture.componentRef.setInput('data', userData);
      userFixture.componentRef.setInput('columns', [
        { key: 'id', label: 'User ID' },
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
      ]);

      userFixture.detectChanges();

      expect(userComponent.data()).toBe(userData);
      expect(userComponent.getValue(userData[0], 'username')).toBe('johndoe');
    });
  });

  describe('Accessibility (a11y)', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Table],
      }).compileComponents();

      fixture = TestBed.createComponent(Table);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should have no accessibility violations with empty table', async () => {
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with populated table', async () => {
      fixture.componentRef.setInput('data', [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ]);
      fixture.componentRef.setInput('columns', [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Full Name' },
        { key: 'email', label: 'Email Address' },
      ]);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with selectable rows', async () => {
      fixture.componentRef.setInput('data', [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ]);
      fixture.componentRef.setInput('columns', [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
      ]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with auto-generated headers', async () => {
      fixture.componentRef.setInput('data', [
        { firstName: 'John', lastName: 'Doe', age: 30 },
        { firstName: 'Jane', lastName: 'Smith', age: 25 },
      ]);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with selected rows', async () => {
      const data = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ];
      fixture.componentRef.setInput('data', data);
      fixture.componentRef.setInput('columns', [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
      ]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      component.toggleRow(data[0]);
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with all rows selected', async () => {
      const data = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ];
      fixture.componentRef.setInput('data', data);
      fixture.componentRef.setInput('columns', [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
      ]);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      component.toggleAll();
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should meet WCAG 2.1 Level AA standards', async () => {
      fixture.componentRef.setInput('data', [{ id: 1, name: 'John Doe', status: 'Active' }]);
      fixture.componentRef.setInput('columns', [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status' },
      ]);
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

    it('should have no violations via host component', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });
  });
});
