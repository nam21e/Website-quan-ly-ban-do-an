import { useMemo } from 'react';

export const useAdminAuth = () => {
  const token = localStorage.getItem('admin_token');
  const roles = JSON.parse(localStorage.getItem('admin_roles') || '[]');

  const isAdmin = useMemo(() => {
    return !!token && Array.isArray(roles) && roles.includes('Admin');
  }, [token, roles]);

  return { isAdmin };
};