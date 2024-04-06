import type { OverflowStatus } from "./types"

export function getTooltipPositionClasses(overflowStatus: OverflowStatus) {
  if (overflowStatus.isOverflowingLeft) return "left-0"
  if (overflowStatus.isOverflowingRight) return "right-0"
  return "left-0" // Default position
}

export function getTooltipPointerClasses(overflowStatus: OverflowStatus) {
  if (overflowStatus.isOverflowingLeft) return "left-6"
  if (overflowStatus.isOverflowingRight) return "right-6"
  return "left-6" // Default position for the pointer
}
