import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = (
  {
    redirectPath = '/login',
    token,
    children
  }: {
    redirectPath?: string,
    token: string,
    children?: React.ReactElement
  }
): React.ReactElement => {
  const prevLocation = useLocation();
  if (!token) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={{ redirectTo: prevLocation }}
      />
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;