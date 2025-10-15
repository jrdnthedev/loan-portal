import { Component } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import { Card } from '../../../shared/components/card/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [Dashboard, Card, RouterLink],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {}
