import { Outlet } from "react-router-dom"
import { useRecoilValue } from "recoil"

import FixedSidebar from "../fixed-sidebar"

import { hasManyRolesState } from "components/providers/auth/atoms"

import DashboardHeader from "../dashboard-header"

const DashboardLayout = () => {
  const hasManyRoles = useRecoilValue(hasManyRolesState)
  return (
    <div className="overflow-y-hidden w-screen h-screen">
      <DashboardHeader />
      <div className="flex">
        {!hasManyRoles && <FixedSidebar />}
        <div className="flex flex-wrap h-[calc(100vh-4rem)] overflow-y-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
