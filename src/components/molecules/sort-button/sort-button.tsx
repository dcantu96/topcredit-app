import { useRef, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { ChevronUpDownIcon } from "@heroicons/react/16/solid"

import DropdownList from "components/atoms/dropdown-list"
import { SORT_ORDER } from "../../../constants"

import type { SortButtonProps } from "./types"

const SortButton = ({
  onSortChange,
  sortOrder,
  options = SORT_ORDER,
}: SortButtonProps) => {
  const sortButtonRef = useRef<HTMLButtonElement>(null)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const toggleSortDropdown = () => setIsSortDropdownOpen((prev) => !prev)
  const selectedOrderLabel = options.find((order) => order.value === sortOrder)
    ?.label

  return (
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
              e.target !== sortButtonRef.current && setIsSortDropdownOpen(false)
            }
          >
            {options.map((order) => (
              <DropdownList.Item
                key={order.value}
                text={order.label}
                onClick={() => {
                  onSortChange(order.value)
                  setIsSortDropdownOpen(false)
                }}
              />
            ))}
          </DropdownList>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SortButton
