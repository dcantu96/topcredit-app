import {
  isLoggedInState,
  myProfileState,
} from "components/providers/auth/atoms"
import { useRecoilValue } from "recoil"
import Landing from "../landing"
import CreditScreen from "./credit-screen"
import AdminDashboard from "./admin-dashboard"

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
  const { role } = useRecoilValue(myProfileState)

  switch (role) {
    case "admin":
    case "requests":
      return <AdminDashboard />
    default:
      return <CreditScreen />
  }
}

export default HomePageRouter
