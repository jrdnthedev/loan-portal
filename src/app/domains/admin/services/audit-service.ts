import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditEntry } from '../models/audit-entry';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createAuditEntry(action: string, metadata?: any): Observable<AuditEntry> {
    const auditEntry: Partial<AuditEntry> = {
      // userId: this.getUser(), // Get from auth service
      action: action,
      timestamp: new Date().toISOString(),
      // metadata would be added if the AuditEntry interface supports it
    };

    return this.http.post<AuditEntry>(`${this.apiUrl}/audit-entries`, auditEntry);
  }
}
