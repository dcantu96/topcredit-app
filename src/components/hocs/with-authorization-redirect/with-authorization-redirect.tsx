import {
  hasNoRolesState,
  isLoggedInState,
} from "components/providers/auth/atoms"
import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useRecoilValue } from "recoil"

/**
 * This HOC redirects to an appropriate route depending on the user's status and current route:
 * - Redirects to /dashboard if the user has any role.
 * - Redirects to /new-credit if the user is logged in but has no specific roles, except when already on /new-credit with roles it redirects to /dashboard.
 * - Renders the wrapped component if the user is not logged in.
 */
function withAuthorizationRedirect<P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> {
  const HandleAuth: React.FC<P> = (props) => {
    const isLoggedIn = useRecoilValue(isLoggedInState)
    const hasNoRoles = useRecoilValue(hasNoRolesState)
    const location = useLocation() // Use useLocation hook to get the current route

    // If the user has any roles, always redirect to /dashboard
    if (!hasNoRoles) {
      return <Navigate to="/dashboard" replace />
    }

    // If the user is on the /new-credit route and doesn't have any roles, stay on this page
    // Otherwise, if logged in and not on /new-credit and without roles, redirect to /new-credit
    else if (isLoggedIn && location.pathname !== "/new-credit" && hasNoRoles) {
      console.log("Redirecting to /new-credit", location.pathname, hasNoRoles)
      return <Navigate to="/new-credit" replace />
    }

    // If the user is not logged in, render the original component
    return <Component {...props} />
  }

  return HandleAuth
}

export default withAuthorizationRedirect
