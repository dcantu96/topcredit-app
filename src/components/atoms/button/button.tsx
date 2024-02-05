import { forwardRef, ComponentProps } from "react"

interface BaseButtonProps {
  fullWidth?: boolean
  size?: "sm" | "md" | "lg"
}

interface PrimaryButtonProps extends BaseButtonProps {
  status?: "primary"
  variant?: "danger"
}

interface SecondaryButtonProps extends BaseButtonProps {
  status: "secondary"
  variant?: never
}

interface DarkButtonProps extends BaseButtonProps {
  status: "dark"
  variant?: never
}

export type ButtonProps =
  | PrimaryButtonProps
  | SecondaryButtonProps
  | DarkButtonProps

const Button = forwardRef<
  HTMLButtonElement,
  Omit<ComponentProps<"button">, "className"> & ButtonProps
>(({ children, fullWidth, status, size, variant, ...rest }, ref) => {
  const statusClass =
    status === "dark"
      ? "btn-dark"
      : status === "secondary"
        ? "btn-secondary"
        : variant === "danger"
          ? "btn-primary-danger"
          : "btn-primary"

  const sizeClass =
    size === "sm" ? "btn-small" : size === "lg" ? "btn-large" : "btn-medium"

  return (
    <button
      ref={ref}
      className={`btn ${statusClass} ${sizeClass} ${fullWidth ? "w-full" : ""}`}
      {...rest}
    >
      {children}
    </button>
  )
})

export default Button
