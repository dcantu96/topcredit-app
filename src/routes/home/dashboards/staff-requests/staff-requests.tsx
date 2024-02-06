import { useRef, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  BellAlertIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"

import { authActions, myProfileState } from "components/providers/auth/atoms"
import DropdownList from "components/atoms/dropdown-list"

import logoSmall from "../../../../images/logo_small.png"
import {
  basicDetailsSortOrderAtom,
  basicDetailsSortedSelector,
} from "../../../requests/atoms"

import { STATES_OF_MEXICO } from "../../../../constants"
import { useNavigate } from "react-router-dom"
import NavLink from "components/atoms/nav-link"
const SORT_ORDER = [
  { label: "Más recientes", value: "desc" },
  { label: "Más antiguas", value: "asc" },
] as const

const StaffRequests = () => {
  const navigate = useNavigate()
  const profile = useRecoilValue(myProfileState)
  const profileButtonRef = useRef<HTMLButtonElement>(null)
  const sortButtonRef = useRef<HTMLButtonElement>(null)
  const { logout } = useRecoilValue(authActions)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const toggleProfileDropdown = () => setIsProfileDropdownOpen((prev) => !prev)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const toggleSortDropdown = () => setIsSortDropdownOpen((prev) => !prev)
  const [selectedSortOrder, setSelectedSortOrder] = useRecoilState(
    basicDetailsSortOrderAtom,
  )
  const basicDetails = useRecoilValue(basicDetailsSortedSelector)
  const selectedOrderLabel = SORT_ORDER.find(
    (order) => order.value === selectedSortOrder,
  )?.label

  return (
    <div className="block">
      {/* header */}
      <header className="sticky border-b border-gray-900/10 inset-x-0 top-0 z-40 bg-white">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-x-6">
          {/* logo */}
          <a href="#" className="p-2 -ml-2">
            <span className="sr-only">Topcredit</span>
            <img className="h-8 w-auto" src={logoSmall} alt="topcredit-logo" />
          </a>
          {/* search input */}
          <div className="self-stretch flex-1 flex">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute inset-y-0 left-0 w-5 h-full text-gray-400 pointer-events-none" />
              <input
                type="text"
                className="pr-0 pl-8 placeholder:text-gray-400 py-0 bg-transparent border-0 w-full h-full block focus:ring-0 focus:border-0 focus:outline-none"
                placeholder="Buscar"
              />
            </div>
          </div>
          {/* user */}
          <div className="flex justify-end gap-x-8">
            <button className="btn btn-small btn-transparent group">
              <BellAlertIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-500" />
            </button>
            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={toggleProfileDropdown}
                className="btn btn-small btn-transparent rounded-full bg-gray-300 text-white p-4 relative"
              >
                <span className="absolute inset-0 flex items-center justify-center text-base font-semibold">
                  {profile.firstName?.[0]}
                </span>
              </button>
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <DropdownList
                    onClickOutside={(e) =>
                      e.target !== profileButtonRef.current?.childNodes[0] &&
                      setIsProfileDropdownOpen(false)
                    }
                  >
                    <DropdownList.Item text="Cerrar Sesión" onClick={logout} />
                  </DropdownList>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      {/* pending request */}
      <div className="lg:pr-96">
        <header className="py-4 px-4 sm:px-6 lg:px-8 border-gray-900/10 border-b flex items-center justify-between">
          <h2 className="text-gray-900 leading-7 font-semibold text-base">
            Solicitudes Pendientes
          </h2>
          <div className="relative">
            <button
              ref={sortButtonRef}
              onClick={toggleSortDropdown}
              className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
            >
              {selectedOrderLabel ?? "Ordenar por"}
              <ChevronUpDownIcon className="w-6 h-6 text-gray-400" />
            </button>
            <AnimatePresence>
              {isSortDropdownOpen && (
                <DropdownList
                  onClickOutside={(e) =>
                    e.target !== sortButtonRef.current &&
                    setIsSortDropdownOpen(false)
                  }
                >
                  {SORT_ORDER.map((order) => (
                    <DropdownList.Item
                      key={order.value}
                      text={order.label}
                      onClick={() => {
                        setSelectedSortOrder((prev) =>
                          prev === order.value ? undefined : order.value,
                        )
                        setIsSortDropdownOpen(false)
                      }}
                    />
                  ))}
                </DropdownList>
              )}
            </AnimatePresence>
          </div>
        </header>
        <ul className="list-none m-0 p-0" role="list">
          {basicDetails.map((details) => (
            <li
              key={details.id}
              className="py-4 px-4 sm:px-6 lg:px-8 items-center flex relative border-b border-gray-900/10"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-x-3">
                  <div className="bg-gray-100 p-1 rounded-full flex-none shadow-sm">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  </div>
                  <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                    <a className="flex text-inherit decoration-inherit gap-x-2">
                      <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                        {details.firstName} {details.lastName}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="whitespace-nowrap">
                        {details.email.split("@")[1]}
                      </span>
                    </a>
                  </h2>
                </div>
                <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
                  <p className="whitespace-nowrap">
                    {
                      STATES_OF_MEXICO.find((s) => s.value === details.state)
                        ?.label
                    }
                  </p>
                  <svg
                    viewBox="0 0 2 2"
                    className="fill-[#d1d5db] flex-none w-[0.125rem] h-[0.125rem]"
                  >
                    <circle cx="1" cy="1" r="1"></circle>
                  </svg>
                  <p className="whitespace-nowrap">
                    {new Date(details.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/requests/" + details.id)}
                className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* activity */}
      <aside className="bg-slate-50 lg:border-gray-900/10 lg:border-l lg:overflow-y-auto lg:min-w-96 lg:top-16 lg:right-0 lg:bottom-0 lg:fixed">
        <header className="py-4 px-4 sm:px-6 lg:px-8 min-h-[70px] border-gray-900/10 border-b flex items-center">
          <div className="flex items-baseline justify-between flex-1">
            <h2 className="text-gray-900 leading-7 font-semibold text-base">
              Actividad
            </h2>
            <NavLink to="/requests">Ver todo</NavLink>
          </div>
        </header>
      </aside>
    </div>
  )
}

export default StaffRequests
