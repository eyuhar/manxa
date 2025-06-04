import { Navigate } from "react-router-dom";
import { getToken } from "../services/auth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = getToken();
  return token ? <>{children}</> : <Navigate to="/login" />;
}
