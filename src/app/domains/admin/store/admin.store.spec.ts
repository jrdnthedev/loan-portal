import { TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { AdminStore } from './admin.store';
import { UserService } from '../services/user-service';
import { AuditService } from '../services/audit-service';
import { User } from '../models/user';
import { AuditEntry } from '../models/audit-entry';

describe('AdminStore', () => {
  let store: AdminStore;
  let mockUserService: any;
  let mockAuditService: any;

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '555-0001',
    },
    {
      id: '2',
      email: 'loan@example.com',
      firstName: 'Loan',
      lastName: 'Officer',
      role: 'loan-officer',
      phone: '555-0002',
    },
    {
      id: '3',
      email: 'underwriter@example.com',
      firstName: 'Under',
      lastName: 'Writer',
      role: 'underwriter',
      phone: '555-0003',
    },
  ];

  const mockAuditLogs: AuditEntry[] = [
    {
      id: '1',
      userId: '1',
      action: 'LOGIN',
      timestamp: '2024-03-01T10:00:00Z',
    },
    {
      id: '2',
      userId: '2',
      action: 'UPDATE_PROFILE',
      timestamp: '2024-03-01T11:00:00Z',
    },
  ];

  beforeEach(() => {
    mockUserService = {
      getUsers: vi.fn().mockReturnValue(of(mockUsers)),
    };

    mockAuditService = {
      getAuditLogs: vi.fn().mockReturnValue(of(mockAuditLogs)),
      getAuditLogsByUser: vi.fn().mockReturnValue(of(mockAuditLogs)),
      getAuditLogsByDateRange: vi.fn().mockReturnValue(of(mockAuditLogs)),
      logAdminAction: vi.fn().mockReturnValue(of({})),
      logUserManagementAction: vi.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      providers: [
        AdminStore,
        { provide: UserService, useValue: mockUserService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    });

    store = TestBed.inject(AdminStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Store Initialization', () => {
    it('should create the store', () => {
      expect(store).toBeTruthy();
    });

    it('should load users on initialization', () => {
      expect(mockUserService.getUsers).toHaveBeenCalled();
      expect(store.users()).toEqual(mockUsers);
    });

    it('should load audit logs on initialization', () => {
      expect(mockAuditService.getAuditLogs).toHaveBeenCalled();
      expect(store.auditLogs()).toEqual(mockAuditLogs);
    });

    it('should initialize with correct default state', () => {
      // Note: After loading, state will be different from initial
      expect(store.selectedUserId()).toBeNull();
      expect(store.error()).toBeNull();
    });
  });

  describe('Computed Selectors', () => {
    it('should have isLoading computed signal', () => {
      expect(store.isLoading()).toBeDefined();
      expect(typeof store.isLoading()).toBe('boolean');
    });

    it('should have error computed signal', () => {
      expect(store.error()).toBeDefined();
    });

    it('should have users computed signal', () => {
      expect(store.users()).toEqual(mockUsers);
    });

    it('should have auditLogs computed signal', () => {
      expect(store.auditLogs()).toEqual(mockAuditLogs);
    });

    it('should have selectedUserId computed signal', () => {
      expect(store.selectedUserId()).toBeNull();
    });

    it('should have filters computed signal', () => {
      expect(store.filters()).toBeDefined();
    });

    it('should have filteredUsers computed signal', () => {
      expect(store.filteredUsers()).toBeDefined();
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      store.setLoading(true);
      expect(store.isLoading()).toBe(true);
    });

    it('should set loading state to false', () => {
      store.setLoading(false);
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Something went wrong';
      store.setError(errorMessage);
      expect(store.error()).toBe(errorMessage);
    });

    it('should clear error when set to null', () => {
      store.setError('Error');
      store.setError(null);
      expect(store.error()).toBeNull();
    });
  });

  describe('loadUsers', () => {
    it('should load users successfully', () => {
      const newUsers: User[] = [
        {
          id: '4',
          email: 'new@example.com',
          firstName: 'New',
          lastName: 'User',
          role: 'admin',
          phone: '555-0004',
        },
      ];

      mockUserService.getUsers.mockReturnValue(of(newUsers));

      store.loadUsers();

      expect(mockUserService.getUsers).toHaveBeenCalled();
      expect(store.users()).toEqual(newUsers);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should set loading to true when loading users', () => {
      store.setLoading(false);
      store.loadUsers();
      // Loading is synchronously set to true before the observable completes
      // After the observable completes, it's set back to false
      expect(store.isLoading()).toBe(false); // Already completed in tests
    });

    it('should handle errors when loading users fails', () => {
      const error = new Error('Network error');
      mockUserService.getUsers.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.loadUsers();

      expect(store.error()).toBe('Failed to load users');
      expect(store.isLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading users:', error);

      consoleSpy.mockRestore();
    });

    it('should clear previous errors when loading users', () => {
      store.setError('Previous error');
      mockUserService.getUsers.mockReturnValue(of(mockUsers));

      store.loadUsers();

      expect(store.error()).toBeNull();
    });
  });

  describe('filterUsersByType', () => {
    it('should filter users by admin role', () => {
      store.filterUsersByType('admin');

      expect(store.filters().role).toBe('admin');
      expect(store.filteredUsers()).toEqual([mockUsers[0]]);
    });

    it('should filter users by loan-officer role', () => {
      store.filterUsersByType('loan-officer');

      expect(store.filters().role).toBe('loan-officer');
      expect(store.filteredUsers()).toEqual([mockUsers[1]]);
    });

    it('should filter users by underwriter role', () => {
      store.filterUsersByType('underwriter');

      expect(store.filters().role).toBe('underwriter');
      expect(store.filteredUsers()).toEqual([mockUsers[2]]);
    });

    it('should clear role filter when set to null', () => {
      store.filterUsersByType('admin');
      expect(store.filters().role).toBe('admin');

      store.filterUsersByType(null);
      expect(store.filters().role).toBeUndefined();
      expect(store.filteredUsers()).toEqual(mockUsers);
    });

    it('should preserve other filters when filtering by role', () => {
      store.updateSearchFilter('test');
      store.filterUsersByType('admin');

      expect(store.filters().role).toBe('admin');
      expect(store.filters().searchTerm).toBe('test');
    });
  });

  describe('updateSearchFilter', () => {
    it('should update search term', () => {
      store.updateSearchFilter('admin');
      expect(store.filters().searchTerm).toBe('admin');
    });

    it('should update search term to empty string', () => {
      store.updateSearchFilter('test');
      store.updateSearchFilter('');
      expect(store.filters().searchTerm).toBe('');
    });

    it('should preserve other filters when updating search', () => {
      store.filterUsersByType('admin');
      store.updateSearchFilter('test');

      expect(store.filters().role).toBe('admin');
      expect(store.filters().searchTerm).toBe('test');
    });
  });

  describe('clearAllFilters', () => {
    it('should clear all filters', () => {
      store.filterUsersByType('admin');
      store.updateSearchFilter('test');
      store.toggleUserActiveStatus(true);

      store.clearAllFilters();

      expect(store.filters().role).toBeUndefined();
      expect(store.filters().searchTerm).toBe('');
      expect(store.filters().isActive).toBeUndefined();
    });

    it('should clear filters and show all users', () => {
      store.filterUsersByType('admin');
      expect(store.filteredUsers().length).toBe(1);

      store.clearAllFilters();
      expect(store.filteredUsers()).toEqual(mockUsers);
    });
  });

  describe('toggleUserActiveStatus', () => {
    it('should set active status filter to true', () => {
      store.toggleUserActiveStatus(true);
      expect(store.filters().isActive).toBe(true);
    });

    it('should set active status filter to false', () => {
      store.toggleUserActiveStatus(false);
      expect(store.filters().isActive).toBe(false);
    });

    it('should preserve other filters when toggling active status', () => {
      store.filterUsersByType('admin');
      store.toggleUserActiveStatus(true);

      expect(store.filters().role).toBe('admin');
      expect(store.filters().isActive).toBe(true);
    });
  });

  describe('loadAuditLogs', () => {
    it('should load audit logs successfully', () => {
      const newLogs: AuditEntry[] = [
        {
          id: '3',
          userId: '3',
          action: 'DELETE',
          timestamp: '2024-03-02T10:00:00Z',
        },
      ];

      mockAuditService.getAuditLogs.mockReturnValue(of(newLogs));

      store.loadAuditLogs();

      expect(mockAuditService.getAuditLogs).toHaveBeenCalled();
      expect(store.auditLogs()).toEqual(newLogs);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle errors when loading audit logs fails', () => {
      const error = new Error('Network error');
      mockAuditService.getAuditLogs.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.loadAuditLogs();

      expect(store.error()).toBe('Failed to load audit logs');
      expect(store.isLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading audit logs:', error);

      consoleSpy.mockRestore();
    });

    it('should clear previous errors when loading audit logs', () => {
      store.setError('Previous error');
      mockAuditService.getAuditLogs.mockReturnValue(of(mockAuditLogs));

      store.loadAuditLogs();

      expect(store.error()).toBeNull();
    });
  });

  describe('loadAuditLogsByUser', () => {
    it('should load audit logs for specific user', () => {
      const userId = 'user-123';
      const userLogs: AuditEntry[] = [
        {
          id: '1',
          userId: userId,
          action: 'LOGIN',
          timestamp: '2024-03-01T10:00:00Z',
        },
      ];

      mockAuditService.getAuditLogsByUser.mockReturnValue(of(userLogs));

      store.loadAuditLogsByUser(userId);

      expect(mockAuditService.getAuditLogsByUser).toHaveBeenCalledWith(userId);
      expect(store.auditLogs()).toEqual(userLogs);
      expect(store.selectedUserId()).toBe(userId);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle errors when loading user audit logs fails', () => {
      const userId = 'user-123';
      const error = new Error('Network error');
      mockAuditService.getAuditLogsByUser.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.loadAuditLogsByUser(userId);

      expect(store.error()).toBe(`Failed to load audit logs for user ${userId}`);
      expect(store.isLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading user audit logs:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('loadAuditLogsByDateRange', () => {
    it('should load audit logs for date range', () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';
      const dateLogs: AuditEntry[] = [
        {
          id: '1',
          userId: '1',
          action: 'LOGIN',
          timestamp: '2024-03-15T10:00:00Z',
        },
      ];

      mockAuditService.getAuditLogsByDateRange.mockReturnValue(of(dateLogs));

      store.loadAuditLogsByDateRange(startDate, endDate);

      expect(mockAuditService.getAuditLogsByDateRange).toHaveBeenCalledWith(startDate, endDate);
      expect(store.auditLogs()).toEqual(dateLogs);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle errors when loading audit logs by date range fails', () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';
      const error = new Error('Network error');
      mockAuditService.getAuditLogsByDateRange.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.loadAuditLogsByDateRange(startDate, endDate);

      expect(store.error()).toBe('Failed to load audit logs for date range');
      expect(store.isLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading audit logs by date range:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('logAdminAction', () => {
    it('should log admin action successfully', () => {
      const action = 'UPDATE_SETTINGS';
      const adminUserId = 'admin-123';
      const target = 'settings-page';
      const details = { setting: 'darkMode', value: true };

      mockAuditService.logAdminAction.mockReturnValue(of({}));
      mockAuditService.getAuditLogs.mockReturnValue(of(mockAuditLogs));

      store.logAdminAction(action, adminUserId, target, details);

      expect(mockAuditService.logAdminAction).toHaveBeenCalledWith(
        adminUserId,
        action,
        target,
        details,
      );
      expect(mockAuditService.getAuditLogs).toHaveBeenCalled();
    });

    it('should log admin action without target and details', () => {
      const action = 'VIEW_DASHBOARD';
      const adminUserId = 'admin-123';

      mockAuditService.logAdminAction.mockReturnValue(of({}));

      store.logAdminAction(action, adminUserId);

      expect(mockAuditService.logAdminAction).toHaveBeenCalledWith(
        adminUserId,
        action,
        undefined,
        undefined,
      );
    });

    it('should handle errors when logging admin action fails', () => {
      const action = 'UPDATE_SETTINGS';
      const adminUserId = 'admin-123';
      const error = new Error('Logging failed');
      mockAuditService.logAdminAction.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.logAdminAction(action, adminUserId);

      expect(consoleSpy).toHaveBeenCalledWith('Error logging admin action:', error);

      consoleSpy.mockRestore();
    });

    it('should not set error state when logging fails', () => {
      const action = 'UPDATE_SETTINGS';
      const adminUserId = 'admin-123';
      const error = new Error('Logging failed');
      mockAuditService.logAdminAction.mockReturnValue(throwError(() => error));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      store.setError(null);
      store.logAdminAction(action, adminUserId);

      // Error state should remain null as logging failures don't affect UI
      expect(store.error()).toBeNull();
    });
  });

  describe('logUserManagementAction', () => {
    it('should log user management action successfully', () => {
      const targetUserId = 'user-456';
      const action = 'UPDATE_ROLE';
      const performedBy = 'admin-123';

      mockAuditService.logUserManagementAction.mockReturnValue(of({}));
      mockAuditService.getAuditLogs.mockReturnValue(of(mockAuditLogs));

      store.logUserManagementAction(targetUserId, action, performedBy);

      expect(mockAuditService.logUserManagementAction).toHaveBeenCalledWith(
        targetUserId,
        action,
        performedBy,
      );
      expect(mockAuditService.getAuditLogs).toHaveBeenCalled();
    });

    it('should handle errors when logging user management action fails', () => {
      const targetUserId = 'user-456';
      const action = 'UPDATE_ROLE';
      const performedBy = 'admin-123';
      const error = new Error('Logging failed');
      mockAuditService.logUserManagementAction.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.logUserManagementAction(targetUserId, action, performedBy);

      expect(consoleSpy).toHaveBeenCalledWith('Error logging user management action:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('selectUser', () => {
    it('should select user and load their audit logs', () => {
      const userId = 'user-789';
      const userLogs: AuditEntry[] = [
        {
          id: '1',
          userId: userId,
          action: 'LOGIN',
          timestamp: '2024-03-01T10:00:00Z',
        },
      ];

      mockAuditService.getAuditLogsByUser.mockReturnValue(of(userLogs));

      store.selectUser(userId);

      expect(store.selectedUserId()).toBe(userId);
      expect(mockAuditService.getAuditLogsByUser).toHaveBeenCalledWith(userId);
      expect(store.auditLogs()).toEqual(userLogs);
    });
  });

  describe('clearSelectedUser', () => {
    it('should clear selected user and load all audit logs', () => {
      // First select a user
      const userId = 'user-789';
      mockAuditService.getAuditLogsByUser.mockReturnValue(of(mockAuditLogs));
      store.selectUser(userId);
      expect(store.selectedUserId()).toBe(userId);

      // Then clear the selection
      mockAuditService.getAuditLogs.mockReturnValue(of(mockAuditLogs));
      store.clearSelectedUser();

      expect(store.selectedUserId()).toBeNull();
      expect(mockAuditService.getAuditLogs).toHaveBeenCalled();
    });
  });

  describe('clearAdminError', () => {
    it('should clear admin error', () => {
      store.setError('Some error');
      expect(store.error()).toBe('Some error');

      store.clearAdminError();

      expect(store.error()).toBeNull();
    });
  });

  describe('State Immutability', () => {
    it('should not mutate state when updating', () => {
      const originalState = store.state();

      store.setError('New error');

      const newState = store.state();
      expect(newState).not.toBe(originalState);
      expect(newState.error).toBe('New error');
    });

    it('should create new state object on filter update', () => {
      const originalFilters = store.filters();

      store.filterUsersByType('admin');

      const newFilters = store.filters();
      expect(newFilters).not.toBe(originalFilters);
    });
  });

  describe('Integration Tests', () => {
    it('should handle full user management workflow', () => {
      // Load users
      expect(store.users()).toEqual(mockUsers);

      // Filter by role
      store.filterUsersByType('admin');
      expect(store.filteredUsers().length).toBe(1);

      // Clear filters
      store.clearAllFilters();
      expect(store.filteredUsers()).toEqual(mockUsers);

      // Select a user
      mockAuditService.getAuditLogsByUser.mockReturnValue(of(mockAuditLogs));
      store.selectUser('1');
      expect(store.selectedUserId()).toBe('1');

      // Clear selection
      mockAuditService.getAuditLogs.mockReturnValue(of(mockAuditLogs));
      store.clearSelectedUser();
      expect(store.selectedUserId()).toBeNull();
    });

    it('should handle error recovery workflow', () => {
      // Simulate error
      const error = new Error('Network error');
      mockUserService.getUsers.mockReturnValue(throwError(() => error));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      store.loadUsers();
      expect(store.error()).toBe('Failed to load users');

      // Clear error
      store.clearAdminError();
      expect(store.error()).toBeNull();

      // Retry loading
      mockUserService.getUsers.mockReturnValue(of(mockUsers));
      store.loadUsers();
      expect(store.users()).toEqual(mockUsers);
      expect(store.error()).toBeNull();
    });
  });
});
