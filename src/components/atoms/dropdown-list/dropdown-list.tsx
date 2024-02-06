import { motion } from "framer-motion"
import DropdownListItem from "../dropdown-list-item"
import { useEffect, useRef } from "react"

interface DropdownListProps {
  children?: React.ReactNode
  onClickOutside?: (e: MouseEvent) => void
}

const DropdownList = ({ children, onClickOutside }: DropdownListProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target
    if (ref.current && target && !ref.current.contains(target as Node)) {
      onClickOutside?.(e)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  })

  return (
    <motion.div
      className="absolute right-0 pt-1 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={ref}
        className="flex flex-col w-40 rounded-lg shadow-md overflow-hidden bg-white"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

DropdownList.Item = DropdownListItem

export default DropdownList
