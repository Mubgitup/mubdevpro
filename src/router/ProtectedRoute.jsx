import React, { useEffect, useState } from 'react';
import { Navigate } from './Router';
import api from '../services/api';

/**
 * Route protection wrapper for administrative views.
 * Restores and validates the stored bearer token before rendering admin views.
 */
export const ProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const handleAuthExpired = () => {
      if (active) {
        setAuthenticated(false);
        setChecking(false);
      }
    };

    window.addEventListener('mubdev:auth-expired', handleAuthExpired);

    if (!localStorage.getItem('mubdev_token')) {
      setChecking(false);
      return () => {
        active = false;
        window.removeEventListener('mubdev:auth-expired', handleAuthExpired);
      };
    }

    api.auth.me()
      .then(() => {
        if (active) setAuthenticated(true);
      })
      .catch((error) => {
        if (active) setAuthenticated(error.status !== 401);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
      window.removeEventListener('mubdev:auth-expired', handleAuthExpired);
    };
  }, []);

  if (checking) {
    return null;
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;

