import { Outlet } from "react-router-dom"
import Content from "../content"
import Sidebar from "../sidebar"
import Header from "../header"

const DashboardLayout = () => {
  return (
    <div>
      <Header />
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Sidebar />
          <Content>
            <Outlet />
          </Content>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
