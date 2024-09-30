/**
 * PrivateRoute component is a wrapper around the Outlet component from react-router-dom.
 */

import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../Contexts/authContext';
import React from 'react';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;