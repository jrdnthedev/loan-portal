import { Component } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import { Card } from '../../../shared/components/card/card';

@Component({
  selector: 'app-shell',
  imports: [Dashboard, Card],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {}
