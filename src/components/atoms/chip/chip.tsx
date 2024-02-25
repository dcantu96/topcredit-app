interface ChipProps {
  children?: React.ReactNode
  status?: "success" | "warning" | "error" | "info"
}

const Chip = ({ children }: ChipProps) => (
  <span className="whitespace-nowrap rounded-full py-1 px-2 text-xs bg-indigo-400/10 text-indigo-400 border-indigo-400 border">
    {children}
  </span>
)

export default Chip
