import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table<T> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];

  ngOnInit() {
    console.log(this.data);
  }

  get headers(): string[] {
    // If columns are provided, use them; otherwise auto-generate from data
    if (this.columns && this.columns.length > 0) {
      return this.columns.map((col: TableColumn) => col.key);
    }

    if (this.data && this.data.length > 0) {
      return Object.keys(this.data[0] as object);
    }
    return [];
  }

  getHeaderLabel(key: string): string {
    const column = this.columns.find((col) => col.key === key);
    return column ? column.label : key;
  }

  getValue(row: T, key: string): T {
    return (row as any)[key];
  }
}
