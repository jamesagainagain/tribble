import type { UserRole } from '@/types';
import { useAuthStore } from '@/store/authSlice';

interface RoleGateProps {
  role: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  individual: -1,
  ngo_viewer: 0,
  analyst: 1,
  admin: 2,
};

export const RoleGate = ({ role, children, fallback = null }: RoleGateProps) => {
  const { user } = useAuthStore();
  if (!user) return <>{fallback}</>;

  const roles = Array.isArray(role) ? role : [role];
  const userLevel = ROLE_HIERARCHY[user.role];
  const hasAccess = roles.some((r) => userLevel >= ROLE_HIERARCHY[r]);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
