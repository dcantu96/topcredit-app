export interface Toast {
  status: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center"
}
