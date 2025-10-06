import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() buttonText = 'New Button';
  clicked = output<void>();

  handleClick() {
    this.clicked.emit();
  }
}
