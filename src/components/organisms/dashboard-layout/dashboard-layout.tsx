import { Outlet } from "react-router-dom"
import { useRecoilValue } from "recoil"

import FixedSidebar from "../fixed-sidebar"

import { showDashboardSidebarSelector } from "components/providers/auth/atoms"

import DashboardHeader from "../dashboard-header"
import { Suspense } from "react"
import LoadingList from "components/atoms/loading-list"

const DashboardLayout = () => {
  const showSidebar = useRecoilValue(showDashboardSidebarSelector)
  return (
    <>
      <DashboardHeader>
        <DashboardHeader.Search />
      </DashboardHeader>
      {showSidebar && <FixedSidebar />}

      <div className="flex ml-16 flex-wrap mt-16 overflow-y-auto">
        <Suspense fallback={<LoadingList />}>
          <Outlet />
        </Suspense>
      </div>
    </>
  )
}

export default DashboardLayout
