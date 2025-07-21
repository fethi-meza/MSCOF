
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"student" | "instructor" | "admin">;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please log in to view this page",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    toast({
      title: "Access denied",
      description: "You don't have permission to view this page",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
