import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditEntry } from '../models/audit-entry';

export interface AuditFilters {
  userId?: string;
  action?: string;
  dateRange?: { start: string; end: string };
  searchTerm?: string;
}

export interface PaginatedAuditResponse {
  data: AuditEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all audit logs
   */
  getAuditLogs(): Observable<AuditEntry[]> {
    return this.http
      .get<PaginatedAuditResponse>(`${this.apiUrl}/audit-logs`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get audit logs for a specific user
   */
  getAuditLogsByUser(userId: string): Observable<AuditEntry[]> {
    return this.http.get<AuditEntry[]>(`${this.apiUrl}/audit-logs/user/${userId}`);
  }

  /**
   * Get audit logs within a date range
   */
  getAuditLogsByDateRange(startDate: string, endDate: string): Observable<AuditEntry[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);

    return this.http.get<AuditEntry[]>(`${this.apiUrl}/audit-logs/date-range`, { params });
  }

  /**
   * Create a new audit entry
   */
  createAuditEntry(auditEntry: Partial<AuditEntry>): Observable<AuditEntry> {
    const entry: Partial<AuditEntry> = {
      ...auditEntry,
      id: `audit-${Date.now()}`, // Generate a unique ID
      timestamp: new Date().toISOString(),
    };
    console.log('logged audit entry');
    return this.http.post<AuditEntry>(`${this.apiUrl}/audit-logs`, entry);
  }

  /**
   * Log a user action
   */
  logUserAction(userId: string, action: string, metadata?: any): Observable<AuditEntry> {
    const auditEntry: Partial<AuditEntry> = {
      userId,
      action,
      timestamp: new Date().toISOString(),
      // metadata would be added when the interface supports it
    };
    console.log('logged user action');
    return this.createAuditEntry(auditEntry);
  }

  /**
   * Get paginated audit logs
   */
  getAuditLogsPaginated(
    page: number,
    limit: number,
    filters?: AuditFilters,
  ): Observable<PaginatedAuditResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (filters) {
      if (filters.userId) params = params.set('userId', filters.userId);
      if (filters.action) params = params.set('action', filters.action);
      if (filters.searchTerm) params = params.set('search', filters.searchTerm);
      if (filters.dateRange) {
        params = params.set('startDate', filters.dateRange.start);
        params = params.set('endDate', filters.dateRange.end);
      }
    }

    return this.http.get<PaginatedAuditResponse>(`${this.apiUrl}/audit-logs/paginated`, { params });
  }

  /**
   * Get audit logs with filters
   */
  getFilteredAuditLogs(filters: {
    userId?: string;
    action?: string;
    dateRange?: { start: string; end: string };
    searchTerm?: string;
  }): Observable<AuditEntry[]> {
    let params = new HttpParams();

    if (filters.userId) {
      params = params.set('userId', filters.userId);
    }
    if (filters.action) {
      params = params.set('action', filters.action);
    }
    if (filters.searchTerm) {
      params = params.set('search', filters.searchTerm);
    }
    if (filters.dateRange) {
      params = params.set('startDate', filters.dateRange.start);
      params = params.set('endDate', filters.dateRange.end);
    }

    return this.http
      .get<PaginatedAuditResponse>(`${this.apiUrl}/audit-logs`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Log loan-related actions
   */
  logLoanAction(loanId: string, action: string, userId: string): Observable<AuditEntry> {
    const auditAction = `${action}: Loan ${loanId}`;
    console.log('logged loan action');
    return this.logUserAction(userId, auditAction, { loanId, type: 'loan' });
  }

  /**
   * Log user management actions
   */
  logUserManagementAction(
    targetUserId: string,
    action: string,
    performedBy: string,
  ): Observable<AuditEntry> {
    const auditAction = `${action}: User ${targetUserId}`;
    return this.logUserAction(performedBy, auditAction, { targetUserId, type: 'user-management' });
  }

  /**
   * Log system actions
   */
  logSystemAction(action: string, details?: any): Observable<AuditEntry> {
    const auditEntry: Partial<AuditEntry> = {
      userId: 'system',
      action: `SYSTEM: ${action}`,
      timestamp: new Date().toISOString(),
      // details would be added when metadata is supported
    };

    return this.createAuditEntry(auditEntry);
  }

  /**
   * Log authentication actions
   */
  logAuthAction(
    userId: string,
    action: 'login' | 'logout' | 'failed-login' | 'password-reset',
    details?: any,
  ): Observable<AuditEntry> {
    const auditAction = `AUTH: ${action.toUpperCase()}`;
    return this.logUserAction(userId, auditAction, { type: 'authentication', ...details });
  }

  /**
   * Log admin console actions
   */
  logAdminAction(
    adminUserId: string,
    action: string,
    target?: string,
    details?: any,
  ): Observable<AuditEntry> {
    const auditAction = target ? `ADMIN: ${action} - ${target}` : `ADMIN: ${action}`;
    return this.logUserAction(adminUserId, auditAction, { type: 'admin', target, ...details });
  }

  /**
   * Delete audit logs older than specified date (admin function)
   */
  deleteAuditLogsBefore(date: string): Observable<{ deletedCount: number }> {
    return this.http.delete<{ deletedCount: number }>(`${this.apiUrl}/audit-logs/cleanup/${date}`);
  }

  /**
   * Get audit statistics
   */
  getAuditStatistics(dateRange?: { start: string; end: string }): Observable<{
    totalEntries: number;
    uniqueUsers: number;
    topActions: Array<{ action: string; count: number }>;
    entriesByDate: Array<{ date: string; count: number }>;
  }> {
    let params = new HttpParams();

    if (dateRange) {
      params = params.set('startDate', dateRange.start);
      params = params.set('endDate', dateRange.end);
    }

    return this.http.get<any>(`${this.apiUrl}/audit-logs/statistics`, { params });
  }
}
