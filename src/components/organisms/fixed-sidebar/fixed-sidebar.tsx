import { NavLink, useMatch } from "react-router-dom"
import {
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid"
import { useRecoilValue } from "recoil"
import { myProfileState, userRolesState } from "components/providers/auth/atoms"
import { SidebarRoutes } from "src/schema.types"
import useIsRole from "hooks/useIsRole"

const FixedSidebar = () => {
  const roles = useRecoilValue(userRolesState)
  const profile = useRecoilValue(myProfileState)
  const hrCompanyId = profile?.hrCompanyId
  const isAdmin = useIsRole("admin")
  const isHR = useIsRole("hr")
  const isPathActive = useMatch(`/dashboard/companies`)

  return (
    <div className="w-16 fixed bg-slate-50 border-gray-900/10 border-r overflow-y-auto inline-block top-16 bottom-0">
      <nav className="lg:text-sm lg:leading-6 relative py-4 overflow-hidden">
        <ul>
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
                  <span className="max-w-10 truncate">{label}</span>
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
                  <span className="max-w-10 truncate">Clientes</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="group flex flex-col justify-center items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
                  to="staff"
                >
                  <div className="p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                    <ClipboardDocumentListIcon
                      className={`h-5 w-5 group-hover:text-sky-500 ${
                        isPathActive ? "text-sky-500" : "text-sky-300"
                      }`}
                    />
                  </div>
                  <span className="max-w-10 truncate">Staff</span>
                </NavLink>
              </li>
            </>
          )}
          {isHR && hrCompanyId && (
            <>
              <li>
                <NavLink
                  className="group flex flex-col justify-center items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
                  to={`hr/${hrCompanyId}/requests`}
                >
                  <div className="p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                    <ClipboardDocumentListIcon
                      className={`h-5 w-5 group-hover:text-sky-500 ${
                        isPathActive ? "text-sky-500" : "text-sky-300"
                      }`}
                    />
                  </div>
                  <span className="max-w-10 truncate">Solicitudes</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="group flex flex-col justify-center items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
                  to={"hr/" + hrCompanyId}
                >
                  <div className="p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                    <ClipboardDocumentListIcon
                      className={`h-5 w-5 group-hover:text-sky-500 ${
                        isPathActive ? "text-sky-500" : "text-sky-300"
                      }`}
                    />
                  </div>
                  <span className="max-w-10 truncate">Cartera</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="group flex flex-col justify-center items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
                  to={`hr/${hrCompanyId}/payments`}
                >
                  <div className="p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                    <ClipboardDocumentListIcon
                      className={`h-5 w-5 group-hover:text-sky-500 ${
                        isPathActive ? "text-sky-500" : "text-sky-300"
                      }`}
                    />
                  </div>
                  <span className="max-w-10 truncate">Cobranza</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}

const NavIconByRole = ({
  role,
  path,
}: {
  role: SidebarRoutes
  path: string
}) => {
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
