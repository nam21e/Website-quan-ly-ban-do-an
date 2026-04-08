import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth';

const RequireAdmin = ({ children }) => {
  const { isAdmin } = useAdminAuth();

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default RequireAdmin;