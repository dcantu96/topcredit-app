import { Link as RouterLink, type To } from "react-router-dom"

interface LinkProps {
  to: To
  children: React.ReactNode
}

export const Link = ({ children, to }: LinkProps) => {
  return (
    <RouterLink to={to} className="text-sm hover:underline">
      {children}
    </RouterLink>
  )
}
