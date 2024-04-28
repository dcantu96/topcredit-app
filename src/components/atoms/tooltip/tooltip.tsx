import React, { useState, useMemo } from "react"
import useTooltipOverflowStatus from "./hooks/use-tooltip-overflow-status"
import { getTooltipPointerClasses, getTooltipPositionClasses } from "./utils"
import type { TooltipProps } from "./types"

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  cond = true,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { overflowStatus, tooltipRef } = useTooltipOverflowStatus(isVisible)

  const tooltipPositionClasses = useMemo(
    () => getTooltipPositionClasses(overflowStatus),
    [overflowStatus],
  )
  const tooltipPointerClasses = useMemo(
    () => getTooltipPointerClasses(overflowStatus),
    [overflowStatus],
  )

  return (
    <div className="relative">
      {/* The target element for the tooltip */}
      <div
        onMouseEnter={() => cond && setIsVisible(true)}
        onMouseLeave={() => cond && setIsVisible(false)}
        onFocus={() => cond && setIsVisible(true)}
        onBlur={() => cond && setIsVisible(false)}
        tabIndex={0}
      >
        {children}
      </div>

      {/* The tooltip itself */}
      {isVisible && cond && (
        <div
          ref={tooltipRef}
          className={`absolute bottom-full z-20 mb-2 px-3 py-1 border border-gray-300 text-sm text-gray-900 bg-white rounded-md shadow-md ${tooltipPositionClasses}`}
        >
          <span
            className={`absolute -bottom-1.5 ${tooltipPointerClasses} -z-10 h-3 w-3 border-b border-r border-gray-300 -translate-x-1/2 rotate-45  bg-white`}
          ></span>
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
