import { Navigate } from "react-router-dom";
import { getToken } from "../services/auth";

interface Props {
  children: React.ReactNode;
  location?: string;
}

export default function ProtectedRoute({ children, location }: Props) {
  const token = getToken();
  return token ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
