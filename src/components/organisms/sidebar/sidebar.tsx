import {
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid"
import {
  BuildingLibraryIcon,
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid"
import { NavLink, useMatch } from "react-router-dom"

export const Sidebar = () => {
  const isRequestsActive = useMatch("/requests")
  const isCompaniesActive = useMatch("/clientes")
  return (
    <aside className="hidden lg:block fixed z-20 inset-0 top-[5.3rem] left-[max(0px,calc(50%-40rem))] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto">
      <nav className="lg:text-sm lg:leading-6 relative py-4">
        <ul>
          <li>
            <NavLink
              className="group flex items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
              to="/companies"
            >
              <div className="mr-4 p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <BuildingLibraryIcon
                  className={`h-4 w-4 group-hover:text-sky-500 ${
                    isCompaniesActive ? "text-sky-500" : "text-sky-300"
                  }`}
                />
              </div>
              Clientes
            </NavLink>
          </li>
          <li>
            <NavLink
              className="group flex items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
              to="/requests"
            >
              <div className="mr-4 p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <ClipboardDocumentListIcon
                  className={`h-4 w-4 group-hover:text-sky-500 ${
                    isRequestsActive ? "text-sky-500" : "text-sky-300"
                  }`}
                />
              </div>
              Solicitudes
            </NavLink>
          </li>

          <li>
            <NavLink
              className="group flex items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
              to="/pre-authorizations"
            >
              <div className="mr-4 p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <CheckBadgeIcon
                  className={`h-4 w-4 group-hover:text-sky-500 ${
                    isCompaniesActive ? "text-sky-500" : "text-sky-300"
                  }`}
                />
              </div>
              Pre Autorizaciones
            </NavLink>
          </li>

          <li>
            <NavLink
              className="group flex items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
              to="/authorizations"
            >
              <div className="mr-4 p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <ShieldCheckIcon
                  className={`h-4 w-4 group-hover:text-sky-500 ${
                    isCompaniesActive ? "text-sky-500" : "text-sky-300"
                  }`}
                />
              </div>
              Autorizaciones
            </NavLink>
          </li>

          <li>
            <NavLink
              className="group flex items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
              to="/dispersions"
            >
              <div className="mr-4 p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <CurrencyDollarIcon
                  className={`h-4 w-4 group-hover:text-sky-500 ${
                    isCompaniesActive ? "text-sky-500" : "text-sky-300"
                  }`}
                />
              </div>
              Dispersiones
            </NavLink>
          </li>

          <li>
            <NavLink
              className="group flex items-center lg:text-sm lg:leading-6 mb-4 font-medium text-sky-500"
              to="/installments"
            >
              <div className="mr-4 p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <ExclamationTriangleIcon
                  className={`h-4 w-4 group-hover:text-sky-500 ${
                    isCompaniesActive ? "text-sky-500" : "text-sky-300"
                  }`}
                />
              </div>
              Instalaciones
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
