import { useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import { AnimatePresence } from "framer-motion"
import { BellAlertIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

import DropdownList from "components/atoms/dropdown-list"
import { authActions, myProfileState } from "components/providers/auth/atoms"

import logoSmall from "../../../assets/logo_small.png"
import { NavLink, useNavigate } from "react-router-dom"
import { useApi } from "components/providers/api/useApi"
import { CREDIT_STATUS, USER_STATUSES } from "../../../constants"

interface DashboardHeaderProps {
  children?: React.ReactNode
}

const DashboardHeader = ({ children }: DashboardHeaderProps) => {
  const profile = useRecoilValue(myProfileState)
  const { logout } = useRecoilValue(authActions)
  const profileButtonRef = useRef<HTMLButtonElement>(null)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const toggleProfileDropdown = () => setIsProfileDropdownOpen((prev) => !prev)

  return (
    <header className="fixed border-b border-gray-900/10 inset-x-0 top-0 z-40 bg-white">
      <div className="px-4 h-16 flex items-center justify-between gap-x-6">
        {/* logo */}
        <NavLink to="/" className="p-2 -ml-2">
          <span className="sr-only">Topcredit</span>
          <img className="h-8 w-auto" src={logoSmall} alt="topcredit-logo" />
        </NavLink>
        {/* search input */}
        {children}
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

function debounce(
  func: (e: React.ChangeEvent<HTMLInputElement>) => void,
  timeout = 300,
) {
  let timer: NodeJS.Timeout
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(e)
    }, timeout)
  }
}

const Search = () => {
  const api = useApi()
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([])
  async function saveInput(query: string) {
    if (!query) {
      setSearchResults([])
      return
    }
    const resp = await api.get("users", {
      params: {
        include: "credits",
        filter: {
          query: query.trim(),
        },
        fields: {
          credits: "id,status",
          users: "id,status,firstName,lastName,credits,employeeNumber",
        },
      },
    })
    setSearchResults(resp.data)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResultClick = (user: any) => {
    if (user.credits.data?.[0]) {
      setSearchResults([])
      navigate(`/dashboard/credits/${user.credits.data?.[0].id}`)
    }
  }

  return (
    <>
      <div className="self-stretch flex-1 flex">
        <div className="relative w-full">
          <MagnifyingGlassIcon className="absolute inset-y-0 left-0 w-5 h-full text-gray-400 pointer-events-none" />
          <input
            type="text"
            onChange={debounce((e) => void saveInput(e.target.value))}
            className="pr-0 pl-8 placeholder:text-gray-400 py-0 bg-transparent border-0 w-full h-full block focus:ring-0 focus:border-0 focus:outline-none"
            placeholder="Buscar"
          />
        </div>
      </div>
      {searchResults.length ? (
        <>
          <div className="absolute top-16 overflow-y-scroll max-h-72 left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg">
            {searchResults.map((user) => (
              <div
                onClick={() => handleResultClick(user)}
                key={user.id}
                className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                {user.firstName} {user.lastName} - {user.employeeNumber} -{" "}
                {USER_STATUSES.get(user.status)}
                {user.credits.data?.[0] && (
                  <>
                    {" "}
                    - Crédito:{" "}
                    {CREDIT_STATUS.get(user.credits.data?.[0]?.status)}
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}

DashboardHeader.Search = Search

export default DashboardHeader
