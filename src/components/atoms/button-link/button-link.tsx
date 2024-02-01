import { Link, To } from "react-router-dom"

interface ButtonLinkProps {
  to: To
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  status?: "primary" | "secondary"
}

const ButtonLink = ({ children, to, status, size }: ButtonLinkProps) => {
  const statusClass =
    status === "secondary" ? "btn-link-secondary" : "btn-link-primary"
  const sizeClass =
    size === "sm" ? "btn-small" : size === "lg" ? "btn-large" : "btn-medium"
  return (
    <Link className={`btn-link ${statusClass} ${sizeClass}`} to={to}>
      {children}
    </Link>
  )
}

export default ButtonLink
