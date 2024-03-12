import { Navigate, Outlet } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { userLatestAuthorizedCreditSelectorQuery } from "../routes/new-credit/atoms"

const LatestCreditMonitor = () => {
  const credit = useRecoilValue(userLatestAuthorizedCreditSelectorQuery)

  if (credit?.status === "dispersed") {
    return <Navigate to="/my-credits" />
  }

  return <Outlet />
}

export default LatestCreditMonitor
