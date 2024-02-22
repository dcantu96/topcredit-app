import { isLoggedInState } from "components/providers/auth/atoms"
import React from "react"
import { Navigate } from "react-router-dom"
import { useRecoilValue } from "recoil"

/**
 * This HOC redirects to an appropriate route depending on the user's status and current route:
 * - Redirects to /dashboard if the user has any role.
 * - Redirects to /new-credit if the user is logged in but has no specific roles, except when already on /new-credit with roles it redirects to /dashboard.
 * - Renders the wrapped component if the user is not logged in.
 */
function withAuth<P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> {
  const HandleLoggedIn: React.FC<P> = (props) => {
    const isLoggedIn = useRecoilValue(isLoggedInState)

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />
    }

    // If the user is not logged in, render the original component
    return <Component {...props} />
  }

  return HandleLoggedIn
}

export default withAuth
