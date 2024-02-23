import { useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { AnimatePresence } from "framer-motion"

import { STATES_OF_MEXICO } from "../../constants"
import { basicDetailsSortOrderAtom, basicDetailsSortedSelector } from "./atoms"
import { useNavigate } from "react-router-dom"
import { ChevronUpDownIcon } from "@heroicons/react/16/solid"
import DropdownList from "components/atoms/dropdown-list"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import NavLink from "components/atoms/nav-link"

const SORT_ORDER = [
  { label: "Más recientes", value: "desc" },
  { label: "Más antiguas", value: "asc" },
] as const

const Screen = () => {
  const navigate = useNavigate()
  const sortButtonRef = useRef<HTMLButtonElement>(null)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const toggleSortDropdown = () => setIsSortDropdownOpen((prev) => !prev)
  const basicDetails = useRecoilValue(basicDetailsSortedSelector)
  const [selectedSortOrder, setSelectedSortOrder] = useRecoilState(
    basicDetailsSortOrderAtom,
  )
  const selectedOrderLabel = SORT_ORDER.find(
    (order) => order.value === selectedSortOrder,
  )?.label

  return (
    <>
      {/* pending request */}
      <div className="flex-1 flex-shrink-0">
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
                onClick={() => navigate(details.id)}
                className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* activity */}
      <aside className="bg-slate-50 lg:border-gray-900/10 lg:border-l w-full lg:w-96 lg:top-16 lg:h-full h-fit">
        <header className="py-4 px-4 sm:px-6 lg:px-8 min-h-[70px] border-gray-900/10 border-b flex items-center">
          <div className="flex items-baseline justify-between flex-1">
            <h2 className="text-gray-900 leading-7 font-semibold text-base">
              Actividad
            </h2>
            <NavLink to="/requests">Ver todo</NavLink>
          </div>
        </header>
      </aside>
    </>
  )
}

export default Screen
