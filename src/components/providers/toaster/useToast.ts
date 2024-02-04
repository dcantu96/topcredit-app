import { useRecoilState } from "recoil"
import { toastState } from "./atoms"
import { useRef } from "react"

interface BaseToast {
  title: string
  message: string
  duration?: number
}

interface SuccessToast extends BaseToast {}

interface ErrorToast extends BaseToast {}

const useToast = () => {
  const [toast, setToast] = useRecoilState(toastState)
  const clearTimerRef = useRef<NodeJS.Timeout>()

  const success = ({ title, message, duration = 3000 }: SuccessToast) => {
    clearTimeout(clearTimerRef.current)
    setToast({ status: "success", title, message })

    clearToast(duration)
  }

  const error = ({ title, message, duration = 5000 }: ErrorToast) => {
    clearTimeout(clearTimerRef.current)
    setToast({ status: "error", title, message })

    clearToast(duration)
  }

  const dismiss = () => {
    setToast(undefined)
    clearTimeout(clearTimerRef.current)
  }

  const clearToast = (duration: number) => {
    clearTimerRef.current = setTimeout(() => {
      setToast(undefined)
    }, duration)
  }

  return { toast, success, error, dismiss }
}

export default useToast
