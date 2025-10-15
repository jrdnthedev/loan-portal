import { Component } from '@angular/core';
import { Card } from '../../../shared/components/card/card';

@Component({
  selector: 'app-dashboard',
  imports: [Card],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
