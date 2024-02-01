import { Outlet } from "react-router-dom"

const LoginLayout = () => {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  )
}

export default LoginLayout
