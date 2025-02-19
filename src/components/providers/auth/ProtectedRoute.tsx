import { useRecoilValue } from "recoil"
import { authState, myProfileState } from "./atoms"
import { Navigate, Outlet } from "react-router-dom"
import { Role } from "src/schema.types"

interface ProtectedRouteProps {
  children?: React.ReactNode
  /**
   * specify which roles are allowed to access this route
   * if not specified, all roles are allowed
   * if specified, only the specified roles are allowed
   *
   * `admin` role is always allowed
   */
  allowedRoles?: Role[]
}

export type CustomError = Error & { code?: number }

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const maybeAuth = useRecoilValue(authState)
  const profile = useRecoilValue(myProfileState)

  if (!maybeAuth || !profile) {
    return <Navigate to="/login" replace />
  }

  if (profile && allowedRoles) {
    // Check if user role is not admin and either not in allowedRoles or role is undefined
    const isNotAdmin = profile.roles.indexOf("admin") === -1
    const isRoleAllowed = allowedRoles.some((allowedRole) =>
      profile.roles.includes(allowedRole),
    )

    if (isNotAdmin && !isRoleAllowed) {
      const error: CustomError = new Error("Not Allowed")
      error.code = 403
      throw error
    }
  }

  if (children) {
    return <>{children}</>
  } else {
    return <Outlet />
  }
}

export default ProtectedRoute
