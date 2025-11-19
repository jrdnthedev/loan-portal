import { Component, Input, output } from '@angular/core';
import { KeyTrap } from '../../directives/key-trap';

@Component({
  selector: 'app-modal',
  imports: [KeyTrap],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  @Input() name = '';
  closeBtn = output<void>();

  close() {
    this.closeBtn.emit();
  }
}
