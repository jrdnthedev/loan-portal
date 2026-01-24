import { Component, inject } from '@angular/core';
import { AdminStore } from '../../store/admin.store';
import { Table } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-audit-log',
  imports: [Table],
  templateUrl: './audit-log.html',
  styleUrl: './audit-log.scss',
})
export class AuditLog {
  private store = inject(AdminStore);
  public auditStore = this.store;
}
