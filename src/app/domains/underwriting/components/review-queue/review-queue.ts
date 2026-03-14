import { Component, inject } from '@angular/core';
import { Table, TableColumn } from '../../../../shared/components/table/table';
import { UnderwritingStore } from '../../store/underwriting-store';

@Component({
  selector: 'app-review-queue',
  imports: [Table],
  templateUrl: './review-queue.html',
  styleUrl: './review-queue.scss',
})
export class ReviewQueue {
  columns: TableColumn[] = [
    { key: 'applicantId', label: 'App ID' },
    { key: 'applicant.fulllName', label: 'Applicant' },
    { key: 'requestedAmount', label: 'Amount' },
    { key: 'risk', label: 'Risk' },
    { key: 'status', label: 'Status' },
    { key: 'submittedAt', label: 'Submitted' },
    { key: 'assigned', label: 'Assigned' },
  ];
  private store = inject(UnderwritingStore);
  readonly loanQueue = this.store.queue;
}
