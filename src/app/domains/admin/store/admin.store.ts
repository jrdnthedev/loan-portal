import { Injectable, signal, computed } from '@angular/core';
import { AdminState, initialAdminState } from './admin.state';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
import { UserRole } from '../models/user-role';
import { AuditService } from '../services/audit-service';
import { AuditEntry } from '../models/audit-entry';

@Injectable({
  providedIn: 'root',
})
export class AdminStore {
  // Private state signal
  private readonly _state = signal<AdminState>(initialAdminState);

  // Public state signal (readonly)
  public readonly state = this._state.asReadonly();

  // Computed selectors
  public readonly isLoading = computed(() => this._state().isLoading);
  public readonly error = computed(() => this._state().error);
  public readonly users = computed(() => this._state().users);
  public readonly auditLogs = computed(() => this._state().auditLogs);
  public readonly selectedUserId = computed(() => this._state().selectedUserId);
  public readonly filters = computed(() => this._state().filters);
  public readonly filteredUsers = computed(() => this.filterUsers(this._state()));

  constructor(
    private userservice: UserService,
    private auditservice: AuditService,
  ) {
    // Load users when the store is first created
    this.loadUsers();
    this.loadAuditLogs();
  }
  // State update methods
  private updateState(partialState: Partial<AdminState>): void {
    this._state.update((currentState) => ({ ...currentState, ...partialState }));
  }

  private filterUsers(state: AdminState): User[] {
    let filteredUsers = state.users;

    // Filter by role if specified
    if (state.filters?.role !== undefined) {
      filteredUsers = filteredUsers.filter((user: User) => user.role === state.filters.role);
    }

    return filteredUsers;
  }
  //Actions
  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  loadUsers(): void {
    this.setLoading(true);
    this.setError(null);

    this.userservice.getUsers().subscribe({
      next: (users: User[]) => {
        this.updateState({
          users: users,
          isLoading: false,
        });
      },
      error: (error: Error) => {
        this.setError('Failed to load users');
        this.setLoading(false);
        console.error('Error loading users:', error);
      },
    });
  }
  /**
   * Filters users by the specified user type (role)
   * @param userType - The UserRole to filter by, or null to clear the filter
   */
  filterUsersByType(userType: UserRole | null): void {
    this.updateState({
      filters: { ...this._state().filters, role: userType ?? undefined },
    });
  }

  /**
   * Updates the search term filter
   * @param searchTerm - The search term to filter by
   */
  updateSearchFilter(searchTerm: string): void {
    this.updateState({
      filters: { ...this._state().filters, searchTerm },
    });
  }

  /**
   * Clears all filters, showing all users
   */
  clearAllFilters(): void {
    this.updateState({
      filters: {
        role: undefined,
        isActive: undefined,
        searchTerm: '',
      },
    });
  }

  toggleUserActiveStatus(isActive: boolean): void {
    this.updateState({
      filters: { ...(this._state().filters ?? {}), isActive },
    });
  }

  /**
   * Loads all audit logs
   */
  loadAuditLogs(): void {
    this.setLoading(true);
    this.setError(null);

    this.auditservice.getAuditLogs().subscribe({
      next: (auditLogs: AuditEntry[]) => {
        this.updateState({
          auditLogs,
          isLoading: false,
        });
      },
      error: (error: Error) => {
        this.setError('Failed to load audit logs');
        this.setLoading(false);
        console.error('Error loading audit logs:', error);
      },
    });
  }

  /**
   * Loads audit logs for a specific user
   * @param userId - The ID of the user to load audit logs for
   */
  loadAuditLogsByUser(userId: string): void {
    this.setLoading(true);
    this.setError(null);

    this.auditservice.getAuditLogsByUser(userId).subscribe({
      next: (auditLogs: AuditEntry[]) => {
        this.updateState({
          auditLogs,
          selectedUserId: userId,
          isLoading: false,
        });
      },
      error: (error: Error) => {
        this.setError(`Failed to load audit logs for user ${userId}`);
        this.setLoading(false);
        console.error('Error loading user audit logs:', error);
      },
    });
  }

  /**
   * Loads audit logs within a date range
   * @param startDate - Start date for the audit log filter
   * @param endDate - End date for the audit log filter
   */
  loadAuditLogsByDateRange(startDate: string, endDate: string): void {
    this.setLoading(true);
    this.setError(null);

    this.auditservice.getAuditLogsByDateRange(startDate, endDate).subscribe({
      next: (auditLogs: AuditEntry[]) => {
        this.updateState({
          auditLogs,
          isLoading: false,
        });
      },
      error: (error: Error) => {
        this.setError('Failed to load audit logs for date range');
        this.setLoading(false);
        console.error('Error loading audit logs by date range:', error);
      },
    });
  }

  /**
   * Logs an admin action and refreshes audit logs
   * @param action - The action being performed
   * @param target - Optional target of the action
   * @param adminUserId - ID of the admin performing the action
   * @param details - Optional additional details
   */
  logAdminAction(action: string, adminUserId: string, target?: string, details?: any): void {
    this.auditservice.logAdminAction(adminUserId, action, target, details).subscribe({
      next: () => {
        // Optionally refresh audit logs after logging
        this.loadAuditLogs();
      },
      error: (error: Error) => {
        console.error('Error logging admin action:', error);
        // Don't show error to user for logging failures unless critical
      },
    });
  }

  /**
   * Logs a user management action and refreshes audit logs
   * @param targetUserId - ID of the user being managed
   * @param action - The management action being performed
   * @param performedBy - ID of the admin performing the action
   */
  logUserManagementAction(targetUserId: string, action: string, performedBy: string): void {
    this.auditservice.logUserManagementAction(targetUserId, action, performedBy).subscribe({
      next: () => {
        // Optionally refresh audit logs after logging
        this.loadAuditLogs();
      },
      error: (error: Error) => {
        console.error('Error logging user management action:', error);
      },
    });
  }

  /**
   * Selects a user and loads their audit logs
   * @param userId - The ID of the user to select
   */
  selectUser(userId: string): void {
    this.updateState({ selectedUserId: userId });
    this.loadAuditLogsByUser(userId);
  }

  /**
   * Clears the selected user and loads all audit logs
   */
  clearSelectedUser(): void {
    this.updateState({ selectedUserId: null });
    this.loadAuditLogs();
  }

  /**
   * Clears admin-related errors
   */
  clearAdminError(): void {
    this.setError(null);
  }
}
