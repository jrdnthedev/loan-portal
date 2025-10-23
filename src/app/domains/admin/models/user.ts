import { UserRole } from './user-role';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserOptions;
}

interface UserOptions {
  firstName: string;
  lastName: string;
  phone: string;
}
