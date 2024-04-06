import { useState, useLayoutEffect, useRef } from "react"
import type { OverflowStatus } from "../types"

function useTooltipOverflowStatus(isVisible: boolean): {
  overflowStatus: OverflowStatus
  tooltipRef: React.RefObject<HTMLDivElement>
} {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [overflowStatus, setOverflowStatus] = useState({
    isOverflowingLeft: false,
    isOverflowingRight: false,
  })

  useLayoutEffect(() => {
    const updateOverflowStatus = () => {
      if (!isVisible || !tooltipRef.current) {
        return
      }

      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth

      const isOverflowingLeft = tooltipRect.left < 0
      const isOverflowingRight = tooltipRect.right > viewportWidth

      setOverflowStatus({ isOverflowingLeft, isOverflowingRight })
    }

    updateOverflowStatus()
    // Reset overflow status when tooltip hides
    return () =>
      setOverflowStatus({ isOverflowingLeft: false, isOverflowingRight: false })
  }, [isVisible])

  return { overflowStatus, tooltipRef }
}

export default useTooltipOverflowStatus
