import { Component } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';

@Component({
  selector: 'app-shell',
  imports: [Dashboard],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {}
