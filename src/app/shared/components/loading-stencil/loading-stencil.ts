import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StencilType = 'card' | 'table' | 'form' | 'list';

@Component({
  selector: 'app-loading-stencil',
  imports: [CommonModule],
  templateUrl: './loading-stencil.html',
  styleUrl: './loading-stencil.scss',
})
export class LoadingStencil {
  type = input<StencilType>('card');
  count = input<number>(1);
  rows = input<number>(3);

  get items(): number[] {
    return Array(this.count()).fill(0);
  }

  get tableRows(): number[] {
    return Array(this.rows()).fill(0);
  }
}
