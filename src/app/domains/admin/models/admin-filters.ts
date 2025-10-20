import { UserRole } from './user-role';

export interface AdminFilters {
  role?: UserRole;
  isActive?: boolean;
  searchTerm?: string;
}
