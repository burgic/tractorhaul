// src/components/auth/ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


export const ProtectedRoute: React.FC<{ 
    children: React.ReactNode;
    requiredRole?: string;
    allowedRoles?: string[];
  }> = ({ children, requiredRole, allowedRoles }) => {
    const context = useContext(AuthContext);
  
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      
      const { user } = context;
    
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.user_metadata.role !== requiredRole) {
    return <Navigate to="/" replace/>;
  }

  if (allowedRoles && !allowedRoles.includes(user.user_metadata.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // Use fragment to wrap children
};

export default ProtectedRoute;
