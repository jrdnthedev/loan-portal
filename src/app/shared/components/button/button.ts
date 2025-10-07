import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() buttonText = 'New Button';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  clicked = output<void>();

  handleClick() {
    this.clicked.emit();
  }
}
