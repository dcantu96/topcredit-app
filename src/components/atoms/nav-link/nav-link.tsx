import { Link as RouterLink, type To } from "react-router-dom"

interface LinkProps {
  variant?: "dark"
  to: To
  children: React.ReactNode
}

export const NavLink = ({ children, to, variant }: LinkProps) => {
  return (
    <RouterLink
      to={to}
      className={`text-sm font-medium leading-6 ${
        variant === "dark" ? "text-gray-900" : "text-indigo-400"
      }`}
    >
      {children}
    </RouterLink>
  )
}
