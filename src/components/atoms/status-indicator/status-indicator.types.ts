export type ColorOption =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
export interface StatusIndicatorProps {
  /**
   * @default "primary"
   */
  color?: ColorOption
  /**
   * Extend tailwind classes
   *
   * @default ""
   */
  className?: React.ComponentProps<"div">["className"]
}
