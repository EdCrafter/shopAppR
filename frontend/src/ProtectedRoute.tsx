// ProtectedRoute.tsx
import { type JSX} from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  currentUser: { email: string; role: string } | null;
  children: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ currentUser, children }) => {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
