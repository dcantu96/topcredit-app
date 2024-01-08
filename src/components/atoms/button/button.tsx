import { forwardRef, ComponentProps } from "react";

const Button = forwardRef<
  HTMLButtonElement,
  Omit<ComponentProps<"button">, "className"> & {
    fullWidth?: boolean;
    status?: "primary" | "secondary" | "dark";
    size?: "sm" | "md" | "lg";
  }
>(({ children, fullWidth, status, size, ...rest }, ref) => {
  const statusClass =
    status === "dark"
      ? "btn-dark"
      : status === "secondary"
        ? "btn-secondary"
        : "btn-primary";

  const sizeClass =
    size === "sm" ? "btn-small" : size === "lg" ? "btn-large" : "btn-medium";

  return (
    <button
      ref={ref}
      className={`btn ${statusClass} ${sizeClass} ${fullWidth ? "w-full" : ""}`}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
