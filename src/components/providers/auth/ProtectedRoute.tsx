import { useRecoilValue } from "recoil";
import { authState, myProfileState } from "./atoms";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  /**
   * specify which roles are allowed to access this route
   * if not specified, all roles are allowed
   * if specified, only the specified roles are allowed
   *
   * `admin` role is always allowed
   */
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const maybeAuth = useRecoilValue(authState);
  const profile = useRecoilValue(myProfileState);

  useEffect(() => {
    // Redirect to login if not authenticated or profile is missing
    if (!maybeAuth || !profile) {
      navigate("/login");
      return; // Early return to prevent further checks
    }

    // Check if profile and allowedRoles are valid for further checks
    if (profile && allowedRoles) {
      // Check if user role is not admin and either not in allowedRoles or role is undefined
      const isNotAdmin = profile.role !== "admin";
      const isRoleNotAllowed = profile.role
        ? !allowedRoles.includes(profile.role)
        : true;

      if (isNotAdmin && isRoleNotAllowed) {
        navigate("/not-allowed");
      }
    }
  }, [maybeAuth, profile, navigate, allowedRoles]);

  if (children) {
    return <>{children}</>;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoute;
