import React from 'react';
import { Navigate } from './Router';

/**
 * Route protection wrapper for administrative views.
 * Redirects unauthenticated visitors to /admin/login.
 */
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('mubdev_token');

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;

