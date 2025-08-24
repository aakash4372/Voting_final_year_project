// src/context/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ allowedRole, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isAuthenticated = !!user;
  const userRole = user?.role;

  const validRoles = ['admin', 'voter'];

  if (isAuthenticated && (allowedRole === 'public')) {
    return <Navigate to={`/${userRole}_dashboard`} replace />;
  }

  if (!isAuthenticated && (allowedRole === 'public')) {
    return children;
  }

  if (isAuthenticated && !validRoles.includes(allowedRole)) {
    return <Navigate to={`/${userRole}_dashboard`} replace />;
  }

  if (isAuthenticated && allowedRole !== userRole) {
    return <Navigate to={`/${userRole}_dashboard`} replace />;
  }

  if (isAuthenticated && allowedRole === userRole) {
    return children;
  }

  return <Navigate to={`/login`} replace />;
};

export default PrivateRoute;