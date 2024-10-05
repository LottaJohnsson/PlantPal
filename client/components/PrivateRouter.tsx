import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../Contexts/authContext';
import React from 'react';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();  // Get auth status from context
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;