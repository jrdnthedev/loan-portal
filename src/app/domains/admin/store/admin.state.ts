import { AdminFilters } from '../models/admin-filters';
import { AuditEntry } from '../models/audit-entry';
import { User } from '../models/user';
import { UserRole } from '../models/user-role';

export interface AdminState {
  users: User[];
  selectedUserId: string | null;
  auditLogs: AuditEntry[];
  filters: AdminFilters;
  isLoading: boolean;
  error: string | null;
}

const filters: AdminFilters = {
  role: UserRole.Admin,
  isActive: false,
  searchTerm: '',
};
export const initialAdminState: AdminState = {
  users: [],
  selectedUserId: null,
  auditLogs: [],
  filters: filters,
  isLoading: false,
  error: null,
};
