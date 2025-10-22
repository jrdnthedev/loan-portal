import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loan } from '../../models/loan';

@Component({
  selector: 'app-pending-application',
  imports: [CommonModule],
  templateUrl: './pending-application.html',
  styleUrl: './pending-application.scss',
})
export class PendingApplication {
  @Input({ required: true }) loans: Loan[] = [];
}
