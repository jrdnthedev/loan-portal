import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuditService, AuditFilters, PaginatedAuditResponse } from './audit-service';
import { AuditEntry } from '../models/audit-entry';
import { environment } from '../../../../environments/environment';
import { vi } from 'vitest';

describe('AuditService', () => {
  let service: AuditService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAuditLogs', () => {
    it('should retrieve all audit logs', () => {
      const mockLogs: AuditEntry[] = [
        { id: '1', userId: 'user1', action: 'LOGIN', timestamp: '2024-01-01T10:00:00Z' },
        { id: '2', userId: 'user2', action: 'LOGOUT', timestamp: '2024-01-01T11:00:00Z' },
      ];

      service.getAuditLogs().subscribe((logs) => {
        expect(logs).toEqual(mockLogs);
        expect(logs.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLogs);
    });

    it('should return empty array when no logs exist', () => {
      service.getAuditLogs().subscribe((logs) => {
        expect(logs).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      req.flush([]);
    });
  });

  describe('getAuditLogsByUser', () => {
    it('should retrieve audit logs for specific user', () => {
      const userId = 'user123';
      const mockLogs: AuditEntry[] = [
        { id: '1', userId: userId, action: 'LOGIN', timestamp: '2024-01-01T10:00:00Z' },
      ];

      service.getAuditLogsByUser(userId).subscribe((logs) => {
        expect(logs).toEqual(mockLogs);
        expect(logs[0].userId).toBe(userId);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLogs);
    });
  });

  describe('getAuditLogsByDateRange', () => {
    it('should retrieve audit logs within date range', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const mockLogs: AuditEntry[] = [
        { id: '1', userId: 'user1', action: 'LOGIN', timestamp: '2024-01-15T10:00:00Z' },
      ];

      service.getAuditLogsByDateRange(startDate, endDate).subscribe((logs) => {
        expect(logs).toEqual(mockLogs);
      });

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/audit-logs/date-range`,
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('startDate')).toBe(startDate);
      expect(req.request.params.get('endDate')).toBe(endDate);
      req.flush(mockLogs);
    });
  });

  describe('createAuditEntry', () => {
    it('should create a new audit entry with generated id and timestamp', () => {
      const partialEntry: Partial<AuditEntry> = {
        userId: 'user123',
        action: 'TEST_ACTION',
      };

      vi.spyOn(console, 'log');

      service.createAuditEntry(partialEntry).subscribe((entry) => {
        expect(entry.userId).toBe('user123');
        expect(entry.action).toBe('TEST_ACTION');
        expect(entry.id).toBeDefined();
        expect(entry.timestamp).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.userId).toBe('user123');
      expect(req.request.body.action).toBe('TEST_ACTION');
      expect(req.request.body.id).toContain('audit-');
      expect(console.log).toHaveBeenCalledWith('logged audit entry');

      req.flush({
        ...req.request.body,
      });
    });
  });

  describe('logUserAction', () => {
    it('should log a user action', () => {
      const userId = 'user123';
      const action = 'FILE_UPLOADED';

      vi.spyOn(console, 'log');

      service.logUserAction(userId, action).subscribe((entry) => {
        expect(entry.userId).toBe(userId);
        expect(entry.action).toBe(action);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.userId).toBe(userId);
      expect(req.request.body.action).toBe(action);
      expect(console.log).toHaveBeenCalledWith('logged user action');

      req.flush(req.request.body);
    });

    it('should log user action with metadata', () => {
      const userId = 'user123';
      const action = 'DATA_UPDATED';
      const metadata = { recordId: '456' };

      service.logUserAction(userId, action, metadata).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.body.userId).toBe(userId);
      expect(req.request.body.action).toBe(action);
      req.flush(req.request.body);
    });
  });

  describe('getAuditLogsPaginated', () => {
    it('should retrieve paginated audit logs', () => {
      const page = 1;
      const limit = 10;
      const mockResponse: PaginatedAuditResponse = {
        data: [{ id: '1', userId: 'user1', action: 'LOGIN', timestamp: '2024-01-01T10:00:00Z' }],
        total: 1,
        page: 1,
        limit: 10,
      };

      service.getAuditLogsPaginated(page, limit).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.page).toBe(1);
        expect(response.limit).toBe(10);
      });

      const req = httpMock.expectOne((request) => request.url === `${apiUrl}/audit-logs/paginated`);
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('limit')).toBe('10');
      req.flush(mockResponse);
    });

    it('should include filters in paginated request', () => {
      const filters: AuditFilters = {
        userId: 'user123',
        action: 'LOGIN',
        searchTerm: 'test',
        dateRange: { start: '2024-01-01', end: '2024-01-31' },
      };

      service.getAuditLogsPaginated(1, 10, filters).subscribe();

      const req = httpMock.expectOne((request) => request.url === `${apiUrl}/audit-logs/paginated`);
      expect(req.request.params.get('userId')).toBe('user123');
      expect(req.request.params.get('action')).toBe('LOGIN');
      expect(req.request.params.get('search')).toBe('test');
      expect(req.request.params.get('startDate')).toBe('2024-01-01');
      expect(req.request.params.get('endDate')).toBe('2024-01-31');
      req.flush({ data: [], total: 0, page: 1, limit: 10 });
    });
  });

  describe('getFilteredAuditLogs', () => {
    it('should apply filters to audit logs request', () => {
      const filters = {
        userId: 'user123',
        action: 'LOGIN',
        searchTerm: 'test',
        dateRange: { start: '2024-01-01', end: '2024-01-31' },
      };

      service.getFilteredAuditLogs(filters).subscribe();

      const req = httpMock.expectOne((request) => request.url === `${apiUrl}/audit-logs`);
      expect(req.request.params.get('userId')).toBe('user123');
      expect(req.request.params.get('action')).toBe('LOGIN');
      expect(req.request.params.get('search')).toBe('test');
      expect(req.request.params.get('startDate')).toBe('2024-01-01');
      expect(req.request.params.get('endDate')).toBe('2024-01-31');
      req.flush([]);
    });

    it('should make request without filters when none provided', () => {
      service.getFilteredAuditLogs({}).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.params.keys().length).toBe(0);
      req.flush([]);
    });
  });

  describe('logLoanAction', () => {
    it('should log a loan-related action', () => {
      const loanId = 'loan123';
      const action = 'APPROVED';
      const userId = 'user123';

      vi.spyOn(console, 'log');

      service.logLoanAction(loanId, action, userId).subscribe((entry) => {
        expect(entry.action).toBe(`${action}: Loan ${loanId}`);
        expect(entry.userId).toBe(userId);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.body.action).toBe('APPROVED: Loan loan123');
      expect(console.log).toHaveBeenCalledWith('logged loan action');
      req.flush(req.request.body);
    });
  });

  describe('logUserManagementAction', () => {
    it('should log a user management action', () => {
      const targetUserId = 'target123';
      const action = 'ROLE_CHANGED';
      const performedBy = 'admin123';

      service.logUserManagementAction(targetUserId, action, performedBy).subscribe((entry) => {
        expect(entry.action).toBe(`${action}: User ${targetUserId}`);
        expect(entry.userId).toBe(performedBy);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.body.action).toBe('ROLE_CHANGED: User target123');
      expect(req.request.body.userId).toBe('admin123');
      req.flush(req.request.body);
    });
  });

  describe('logSystemAction', () => {
    it('should log a system action', () => {
      const action = 'DATABASE_BACKUP';

      service.logSystemAction(action).subscribe((entry) => {
        expect(entry.userId).toBe('system');
        expect(entry.action).toBe(`SYSTEM: ${action}`);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.body.userId).toBe('system');
      expect(req.request.body.action).toBe('SYSTEM: DATABASE_BACKUP');
      req.flush(req.request.body);
    });

    it('should log system action with details', () => {
      const action = 'MAINTENANCE';
      const details = { duration: '2h' };

      service.logSystemAction(action, details).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.body.action).toBe('SYSTEM: MAINTENANCE');
      req.flush(req.request.body);
    });
  });

  describe('logAuthAction', () => {
    it('should log authentication actions', () => {
      const userId = 'user123';
      const actions: Array<'login' | 'logout' | 'failed-login' | 'password-reset'> = [
        'login',
        'logout',
        'failed-login',
        'password-reset',
      ];

      actions.forEach((action) => {
        service.logAuthAction(userId, action).subscribe((entry) => {
          expect(entry.action).toBe(`AUTH: ${action.toUpperCase()}`);
          expect(entry.userId).toBe(userId);
        });

        const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
        req.flush(req.request.body);
      });
    });

    it('should log auth action with details', () => {
      const userId = 'user123';
      const details = { ipAddress: '192.168.1.1' };

      service.logAuthAction(userId, 'login', details).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.body.action).toBe('AUTH: LOGIN');
      req.flush(req.request.body);
    });
  });

  describe('logAdminAction', () => {
    it('should log admin action with target', () => {
      const adminUserId = 'admin123';
      const action = 'DELETE_USER';
      const target = 'user456';

      service.logAdminAction(adminUserId, action, target).subscribe((entry) => {
        expect(entry.action).toBe(`ADMIN: ${action} - ${target}`);
        expect(entry.userId).toBe(adminUserId);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.body.action).toBe('ADMIN: DELETE_USER - user456');
      req.flush(req.request.body);
    });

    it('should log admin action without target', () => {
      const adminUserId = 'admin123';
      const action = 'VIEW_DASHBOARD';

      service.logAdminAction(adminUserId, action).subscribe((entry) => {
        expect(entry.action).toBe(`ADMIN: ${action}`);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs`);
      expect(req.request.body.action).toBe('ADMIN: VIEW_DASHBOARD');
      req.flush(req.request.body);
    });
  });

  describe('deleteAuditLogsBefore', () => {
    it('should delete audit logs before specified date', () => {
      const date = '2024-01-01';
      const mockResponse = { deletedCount: 150 };

      service.deleteAuditLogsBefore(date).subscribe((response) => {
        expect(response.deletedCount).toBe(150);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs/cleanup/${date}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('getAuditStatistics', () => {
    it('should retrieve audit statistics without date range', () => {
      const mockStats = {
        totalEntries: 1000,
        uniqueUsers: 50,
        topActions: [
          { action: 'LOGIN', count: 300 },
          { action: 'LOGOUT', count: 250 },
        ],
        entriesByDate: [
          { date: '2024-01-01', count: 50 },
          { date: '2024-01-02', count: 75 },
        ],
      };

      service.getAuditStatistics().subscribe((stats) => {
        expect(stats).toEqual(mockStats);
        expect(stats.totalEntries).toBe(1000);
        expect(stats.uniqueUsers).toBe(50);
      });

      const req = httpMock.expectOne(`${apiUrl}/audit-logs/statistics`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });

    it('should retrieve audit statistics with date range', () => {
      const dateRange = { start: '2024-01-01', end: '2024-01-31' };
      const mockStats = {
        totalEntries: 100,
        uniqueUsers: 10,
        topActions: [],
        entriesByDate: [],
      };

      service.getAuditStatistics(dateRange).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/audit-logs/statistics`,
      );
      expect(req.request.params.get('startDate')).toBe('2024-01-01');
      expect(req.request.params.get('endDate')).toBe('2024-01-31');
      req.flush(mockStats);
    });
  });
});
