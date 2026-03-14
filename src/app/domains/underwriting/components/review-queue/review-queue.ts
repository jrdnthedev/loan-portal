import { Component, inject, effect, signal, computed } from '@angular/core';
import { Table, TableColumn } from '../../../../shared/components/table/table';
import { UnderwritingStore } from '../../store/underwriting-store';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-review-queue',
  imports: [Table, Pagination],
  templateUrl: './review-queue.html',
  styleUrl: './review-queue.scss',
})
export class ReviewQueue {
  private store = inject(UnderwritingStore);
  readonly loanQueue = this.store.queue;
  readonly submittedLoanCount = this.store.submittedLoanCount;

  columns: TableColumn[] = [
    { key: 'applicantId', label: 'App ID' },
    { key: 'applicant.fulllName', label: 'Applicant' },
    { key: 'requestedAmount', label: 'Amount' },
    { key: 'risk', label: 'Risk' },
    { key: 'status', label: 'Status' },
    { key: 'submittedAt', label: 'Submitted' },
    { key: 'assigned', label: 'Assigned' },
  ];
  currentPage = signal(1);
  itemsPerPage = 4;

  readonly paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.loanQueue().slice(start, end);
  });

  onPageChange(page: number) {
    this.currentPage.set(page);
  }
}
