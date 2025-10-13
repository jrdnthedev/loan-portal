import { Component, Input, OnInit, output } from '@angular/core';
import { Subject, throttleTime } from 'rxjs';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button implements OnInit {
  @Input() buttonText = 'New Button';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  clicked = output<void>();
  private submitClick = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.submitClick.pipe(throttleTime(2000)).subscribe(() => {
      this.clicked.emit();
    });
  }
  handleClick() {
    this.submitClick.next();
  }
}
