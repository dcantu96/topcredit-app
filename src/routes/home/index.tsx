import { lazy } from "react"
import {
  isLoggedInState,
  myProfileState,
} from "components/providers/auth/atoms"
import { useRecoilValue } from "recoil"
import Landing from "../landing"
import CreditScreen from "./credit-screen"
const Admin = lazy(() => import("./dashboards/admin"))
const StaffRequests = lazy(() => import("./dashboards/staff-requests"))

/**
 * This component is in charge of rendering a screen depending on the user's authentication status.
 *
 * If the user is authenticated
 *  - and the user has a role,
 *    then he will be redirected to the admin dashboard component.
 *  - and the user does not have any particular role,
 *    then he will be redirected to the user screen.
 *
 * Else, the user will be redirected to the landing component.
 */
const HomePageRouter = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState)
  console.log("home screen")
  if (isLoggedIn) {
    return <Home />
  } else {
    return <Landing />
  }
}

/**
 * This component is in charge of rendering a screen depending on the user's role.
 */
const Home = () => {
  const { roles } = useRecoilValue(myProfileState)

  if (!roles.length) {
    return <CreditScreen />
  }
  if (roles.includes("admin")) {
    return <Admin />
  } else if (roles.includes("requests")) {
    return <StaffRequests />
  } else {
    return <div>error</div>
  }
}

export default HomePageRouter
