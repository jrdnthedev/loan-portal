import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { AdminState, initialAdminState } from './admin.state';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
import { UserRole } from '../models/user-role';
import { AuditService } from '../services/audit-service';

@Injectable({
  providedIn: 'root',
})
export class AdminStore {
  // Private state subject
  private readonly _state$ = new BehaviorSubject<AdminState>(initialAdminState);

  // Public state observable
  public readonly state$ = this._state$.asObservable();

  //Selectors
  public readonly isLoading$ = this.select((state: AdminState) => state.isLoading);
  public readonly error$ = this.select((state: AdminState) => state.error);
  public readonly users$ = this.select((state: AdminState) => state.users);
  public readonly filters$ = this.select((state: AdminState) => state.filters);
  public readonly filteredUsers$ = this.select((state: AdminState) => this.filterUsers(state));

  constructor(
    private userservice: UserService,
    private auditservice: AuditService,
  ) {
    // Load users when the store is first created
    this.loadUsers();
  }
  // State update methods
  private updateState(partialState: Partial<AdminState>): void {
    const currentState = this._state$.value;
    this._state$.next({ ...currentState, ...partialState });
  }

  private select<T>(selector: (state: AdminState) => T): Observable<T> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
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
      error: (error) => {
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
      filters: { ...this._state$.value.filters, role: userType ?? undefined },
    });
  }

  /**
   * Updates the search term filter
   * @param searchTerm - The search term to filter by
   */
  updateSearchFilter(searchTerm: string): void {
    this.updateState({
      filters: { ...this._state$.value.filters, searchTerm },
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
      filters: { ...(this._state$.value.filters ?? {}), isActive },
    });
  }

  //   selectUser() {}

  //   loadAuditLogs() {}

  //   applyAdminFilters() {}

  //   clearAdminError() {}
}
