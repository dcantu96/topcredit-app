import { NavLink, useMatch } from "react-router-dom"
import {
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
} from "@heroicons/react/24/solid"
import { useRecoilValue } from "recoil"
import { userRolesState } from "components/providers/auth/atoms"
import { Role } from "src/schema.types"

const FixedSidebar = () => {
  const roles = useRecoilValue(userRolesState)
  const isHomeActive = useMatch("/dashboard")
  const isAdmin = roles.some((role) => role.value === "admin")
  const isPathActive = useMatch(`/dashboard/companies`)
  return (
    <div className="w-16 bg-slate-50 border-gray-900/10 border-r overflow-y-auto inline-block h-[calc(100vh-4rem)]">
      <nav className="lg:text-sm lg:leading-6 relative py-4 overflow-hidden">
        <ul>
          <li>
            <NavLink
              className="group flex flex-col justify-center items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
              to="/dashboard/requests"
            >
              <div className="p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <HomeIcon
                  className={`h-5 w-5 group-hover:text-sky-500 ${
                    isHomeActive ? "text-sky-500" : "text-sky-300"
                  }`}
                />
              </div>
              Inicio
            </NavLink>
          </li>
          {roles
            .filter((r) => r.value !== "admin")
            .map(({ label, value, path }) => (
              <li key={path}>
                <NavLink
                  className="group flex flex-col text-center justify-center items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
                  to={path}
                >
                  <div className="p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                    <NavIconByRole role={value} path={path} />
                  </div>
                  {label}
                </NavLink>
              </li>
            ))}
          {isAdmin && (
            <>
              <li>
                <NavLink
                  className="group flex flex-col justify-center items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
                  to="companies"
                >
                  <div className="p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                    <ClipboardDocumentListIcon
                      className={`h-5 w-5 group-hover:text-sky-500 ${
                        isPathActive ? "text-sky-500" : "text-sky-300"
                      }`}
                    />
                  </div>
                  Clientes
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}

const NavIconByRole = ({ role, path }: { role: Role; path: string }) => {
  const isPathActive = useMatch(`/dashboard/${path}`)

  switch (role) {
    case "authorizations":
      return (
        <ClipboardDocumentListIcon
          className={`h-5 w-5 group-hover:text-sky-500 ${
            isPathActive ? "text-sky-500" : "text-sky-300"
          }`}
        />
      )
    case "dispersions":
      return (
        <ClipboardDocumentListIcon
          className={`h-5 w-5 group-hover:text-sky-500 ${
            isPathActive ? "text-sky-500" : "text-sky-300"
          }`}
        />
      )
    case "requests":
      return (
        <ClipboardDocumentListIcon
          className={`h-5 w-5 group-hover:text-sky-500 ${
            isPathActive ? "text-sky-500" : "text-sky-300"
          }`}
        />
      )
    case "pre_authorizations":
      return (
        <CheckBadgeIcon
          className={`h-5 w-5 group-hover:text-sky-500 ${
            isPathActive ? "text-sky-500" : "text-sky-300"
          }`}
        />
      )
    case "installations":
      return (
        <ClipboardDocumentListIcon
          className={`h-5 w-5 group-hover:text-sky-500 ${
            isPathActive ? "text-sky-500" : "text-sky-300"
          }`}
        />
      )
    case "payments":
      return (
        <ClipboardDocumentListIcon
          className={`h-5 w-5 group-hover:text-sky-500 ${
            isPathActive ? "text-sky-500" : "text-sky-300"
          }`}
        />
      )
    default:
      return null
  }
}

export default FixedSidebar
