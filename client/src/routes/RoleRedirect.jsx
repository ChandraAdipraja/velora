import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const RoleRedirect = () => {
  const { authUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (authUser.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (authUser.role === "pengurus") {
    return <Navigate to="/pengurus/dashboard" replace />;
  }

  return <Navigate to="/user/dashboard" replace />;
};

export default RoleRedirect;
