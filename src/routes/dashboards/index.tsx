import { lazy } from "react"
import { myProfileState } from "components/providers/auth/atoms"
import { useRecoilValue } from "recoil"
const Admin = lazy(() => import("./admin"))
const StaffRequests = lazy(() => import("./staff-requests"))

/**
 * This component is in charge of rendering a screen depending on the user's role.
 */
const Dashboard = () => {
  const { roles } = useRecoilValue(myProfileState)

  if (roles.includes("admin")) {
    return <Admin />
  } else if (roles.includes("requests")) {
    return <StaffRequests />
  } else if (roles.includes("pre-authorization")) {
    return <div>pre-authorization</div>
  } else {
    return <div>error</div>
  }
}

export default Dashboard
