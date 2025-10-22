import { Component, Input } from '@angular/core';
import { User } from '../../../admin/models/user';

@Component({
  selector: 'app-loan-officer',
  imports: [],
  templateUrl: './loan-officer.html',
  styleUrl: './loan-officer.scss',
})
export class LoanOfficer {
  @Input({ required: true }) loanOfficer: User[] = [];
}
