import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

export interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = useAppSelector((state) => state.auth.token);

  if (token !== null) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;
