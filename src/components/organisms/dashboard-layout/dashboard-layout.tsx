import { Outlet } from "react-router-dom"
import { useRecoilValue } from "recoil"

import FixedSidebar from "../fixed-sidebar"

import { showDashboardSidebarSelector } from "components/providers/auth/atoms"

import DashboardHeader from "../dashboard-header"
import { Suspense } from "react"

const DashboardLayout = () => {
  const showSidebar = useRecoilValue(showDashboardSidebarSelector)
  return (
    <div className="overflow-y-hidden w-screen h-screen">
      <DashboardHeader>
        <DashboardHeader.Search />
      </DashboardHeader>
      <div className="flex">
        {showSidebar && <FixedSidebar />}
        <div className="flex flex-wrap h-[calc(100vh-4rem)] overflow-y-auto w-full">
          <Suspense fallback={<>loading page</>}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
