import { lazy } from "react"
import { myProfileState } from "components/providers/auth/atoms"
import { useRecoilValue } from "recoil"
const Admin = lazy(() => import("./admin"))
const StaffRequests = lazy(() => import("../../routes/requests/list"))

/**
 * This component is in charge of rendering a screen depending on the user's role.
 */
const Dashboard = () => {
  const profile = useRecoilValue(myProfileState)

  if (profile?.roles.includes("admin")) {
    return <Admin />
  } else if (profile?.roles.includes("requests")) {
    return <StaffRequests />
  } else if (profile?.roles.includes("pre-authorization")) {
    return <div>pre-authorization</div>
  } else {
    return <div>error</div>
  }
}

export default Dashboard
