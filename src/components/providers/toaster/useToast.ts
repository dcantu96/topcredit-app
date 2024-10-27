import { useRecoilState } from "recoil"
import { toastState } from "./atoms"
import { useRef } from "react"

interface IToast {
  title: string
  message: string
  duration?: number
  onClose?: () => void
}

const useToast = () => {
  const [toast, setToast] = useRecoilState(toastState)
  const clearTimerRef = useRef<NodeJS.Timeout>()

  const success = ({ title, message, duration = 3000, onClose }: IToast) => {
    clearTimeout(clearTimerRef.current)
    setToast({ status: "success", title, message })

    clearToast(duration, onClose)
  }

  const error = ({ title, message, duration = 5000, onClose }: IToast) => {
    clearTimeout(clearTimerRef.current)
    setToast({ status: "error", title, message })

    clearToast(duration, onClose)
  }

  const dismiss = () => {
    setToast(undefined)
    clearTimeout(clearTimerRef.current)
  }

  const clearToast = (duration: number, onClose?: () => void) => {
    clearTimerRef.current = setTimeout(() => {
      setToast(undefined)
      onClose?.()
    }, duration)
  }

  return { toast, success, error, dismiss }
}

export default useToast
