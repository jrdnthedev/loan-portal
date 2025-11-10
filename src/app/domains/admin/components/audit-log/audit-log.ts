import { Component, inject } from '@angular/core';
import { AdminStore } from '../../store/admin.store';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-audit-log',
  imports: [AsyncPipe],
  templateUrl: './audit-log.html',
  styleUrl: './audit-log.scss',
})
export class AuditLog {
  private store = inject(AdminStore);
  readonly auditLogs$ = this.store.auditLogs$;
}
