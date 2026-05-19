import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if a valid admin token exists in browser storage
  const adminToken = localStorage.getItem('admin_token');

  if (!adminToken) {
    // Force redirect unauthenticated attempts back to the internal login page
    return <Navigate to="/admin/login" replace />;
  }

  // Render the dashboard components safely if authenticated
  return children;
}