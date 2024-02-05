import {
  BellAlertIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import logoSmall from "../../../../images/logo_small.png"
import { useRecoilValue } from "recoil"
import { authActions, myProfileState } from "components/providers/auth/atoms"
import DropdownList from "components/atoms/dropdown-list"
import { useRef, useState } from "react"
import { AnimatePresence } from "framer-motion"

const SORT_ORDER = ["Más recientes", "Más antiguas"]

const StaffRequests = () => {
  const profile = useRecoilValue(myProfileState)
  const profileButtonRef = useRef<HTMLButtonElement>(null)
  const sortButtonRef = useRef<HTMLButtonElement>(null)
  const { logout } = useRecoilValue(authActions)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const toggleProfileDropdown = () => setIsProfileDropdownOpen((prev) => !prev)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const toggleSortDropdown = () => setIsSortDropdownOpen((prev) => !prev)
  const [selectedSortOrder, setSelectedSortOrder] = useState<
    string | undefined
  >(undefined)

  return (
    <div className="block">
      {/* header */}
      <header className="sticky border-b border-gray-900/10 inset-x-0 top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 gap-x-6">
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
      <main className="lg:pr-96">
        <header className="py-4 px-4 border-gray-900/10 border-b flex items-center justify-between">
          <h1 className="text-gray-900 leading-7 font-semibold text-base">
            Solicitudes Pendientes
          </h1>
          <div className="relative">
            <button
              ref={sortButtonRef}
              onClick={toggleSortDropdown}
              className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
            >
              {selectedSortOrder ?? "Ordenar por"}
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
                      key={order}
                      text={order}
                      onClick={() => {
                        setSelectedSortOrder((prev) =>
                          prev === order ? undefined : order,
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
        <ul className="list-none m-0 p-0"></ul>
      </main>
      {/* activity */}
    </div>
  )
}

export default StaffRequests
