import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  standalone: true,
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  @Input() title = '';
}
