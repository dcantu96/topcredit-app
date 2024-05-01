import { ColorOption, StatusIndicatorProps } from "./status-indicator.types"

export const StatusIndicator = ({
  color = "primary",
  className = "",
}: StatusIndicatorProps) => {
  const dotClasses: Record<ColorOption, string> = {
    info: "bg-gray-500",
    primary: "bg-indigo-500",
    secondary: "bg-orange-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  }

  const dotBorderClasses: Record<ColorOption, string> = {
    info: "bg-gray-100",
    primary: "bg-indigo-100",
    secondary: "bg-orange-100",
    success: "bg-green-100",
    warning: "bg-yellow-100",
    error: "bg-red-100",
  }
  return (
    <div
      className={`p-1 rounded-full flex-none shadow-sm ${dotBorderClasses[color]} ${className}`}
    >
      <div className={`w-2 h-2 rounded-full ${dotClasses[color]}`}></div>
    </div>
  )
}

export default StatusIndicator
