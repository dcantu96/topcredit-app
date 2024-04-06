interface ChipProps {
  children?: React.ReactNode
  status?: "success" | "warning" | "error" | "info"
}

const Chip = ({ children, status = "info" }: ChipProps) => {
  const statusClasses: Record<NonNullable<ChipProps["status"]>, string> = {
    success: "bg-green-400/10 text-green-400 border-green-400",
    warning: "bg-yellow-400/10 text-yellow-400 border-yellow-400",
    error: "bg-red-500/10 text-red-500 border-red-500",
    info: "bg-indigo-400/10 text-indigo-400 border-indigo-400",
  }
  return (
    <span
      className={`whitespace-nowrap rounded-full py-1 px-2 text-xs ${statusClasses[status]} border`}
    >
      {children}
    </span>
  )
}

export default Chip
