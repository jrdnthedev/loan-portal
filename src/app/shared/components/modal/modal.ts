import { Component, Input } from '@angular/core';
import { KeyTrap } from '../../directives/key-trap';

@Component({
  selector: 'app-modal',
  imports: [KeyTrap],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  @Input() name = '';
}
