export interface TooltipProps {
  /**
   * Condition to show the tooltip
   *
   * @default true
   */
  cond?: boolean
  /**
   * Content to show in the tooltip
   */
  content: React.ReactNode
  /**
   * The target element for the tooltip
   */
  children: React.ReactNode
}

export interface OverflowStatus {
  isOverflowingLeft: boolean
  isOverflowingRight: boolean
}
