export type UserRole = 'ngo_viewer' | 'analyst' | 'admin' | 'individual';

export interface User {
  id: string;
  name: string;
  email: string;
  organisation: string;
  role: UserRole;
  ngo_id?: string;
  avatar_initials: string;
  region_id?: string;
}
