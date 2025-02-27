import { myProfileState } from "components/providers/auth/atoms"
import { useRecoilValue } from "recoil"
import { Navigate } from "react-router-dom"
/**
 * This component is in charge of rendering a screen depending on the user's role.
 */
const Dashboard = () => {
  const profile = useRecoilValue(myProfileState)

  if (profile?.roles.includes("admin")) {
    return <Navigate to="companies" />
  } else if (profile?.roles.includes("requests")) {
    return <Navigate to="requests" />
  } else if (profile?.roles.includes("pre_authorizations")) {
    return <Navigate to="pre-authorizations" />
  } else if (profile?.roles.includes("authorizations")) {
    return <Navigate to="pending-authorizations" />
  } else if (profile?.roles.includes("dispersions")) {
    return <Navigate to="dispersions" />
  } else if (profile?.roles.includes("hr") && profile.hrCompanyId) {
    return <Navigate to={`hr/${profile.hrCompanyId}`} />
  } else if (profile?.roles.includes("payments")) {
    return <Navigate to={`payments`} />
  } else {
    return <div>dashboard not found</div>
  }
}

export default Dashboard
