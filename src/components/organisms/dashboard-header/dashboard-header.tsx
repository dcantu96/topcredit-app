import { useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import { AnimatePresence } from "framer-motion"
import { BellAlertIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

import DropdownList from "components/atoms/dropdown-list"
import { authActions, myProfileState } from "components/providers/auth/atoms"

import logoSmall from "../../../assets/logo_small.png"

const DashboardHeader = () => {
  const profile = useRecoilValue(myProfileState)
  const { logout } = useRecoilValue(authActions)
  const profileButtonRef = useRef<HTMLButtonElement>(null)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const toggleProfileDropdown = () => setIsProfileDropdownOpen((prev) => !prev)

  return (
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
                {profile?.firstName?.[0]}
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
  )
}

export default DashboardHeader
