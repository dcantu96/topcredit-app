import { lazy } from "react"
import { myProfileState } from "components/providers/auth/atoms"
import { useRecoilValue } from "recoil"
const Admin = lazy(() => import("./admin"))
const StaffRequests = lazy(() => import("../requests/list/list"))
const PreAuthorizations = lazy(
  () => import("../../routes/pre-authorizations/list"),
)
const PendingAuthorizations = lazy(
  () => import("../../routes/pending-authorizations/list"),
)
const Dispersions = lazy(() => import("../../routes/dispersions/list"))
const HR = lazy(() => import("../../routes/hr/general"))

/**
 * This component is in charge of rendering a screen depending on the user's role.
 */
const Dashboard = () => {
  const profile = useRecoilValue(myProfileState)

  if (profile?.roles.includes("admin")) {
    return <Admin />
  } else if (profile?.roles.includes("requests")) {
    return <StaffRequests />
  } else if (profile?.roles.includes("pre_authorizations")) {
    return <PreAuthorizations />
  } else if (profile?.roles.includes("authorizations")) {
    return <PendingAuthorizations />
  } else if (profile?.roles.includes("dispersions")) {
    return <Dispersions />
  } else if (profile?.roles.includes("hr")) {
    return <HR />
  } else {
    return <div>dashboard not found</div>
  }
}

export default Dashboard
