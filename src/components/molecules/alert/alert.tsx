import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/solid"

interface AlertProps {
  title: string
  message: string
  type: "success" | "error" | "warning" | "info"
  onClose?: () => void
}

const Alert = ({ type, message, title, onClose }: AlertProps) => {
  return (
    <div role="alert" className="flex flex-row">
      {/* icon */}
      <div className="block p-1">
        <AlertIcon type={type} />
      </div>
      {/* container with title and message */}
      <div className="block">
        <h4 className="title mb-2">{title}</h4>
        <p className="message">{message}</p>
      </div>
      {/* close button */}
      <button
        onClick={onClose}
        className="bg-transparent border-none text-gray-300 rounded-md"
        aria-label="Close"
      >
        <XMarkIcon />
      </button>
    </div>
  )
}

const AlertIcon = ({ type }: { type: AlertProps["type"] }) => {
  return (
    <div className="icon">
      {type === "success" && <CheckCircleIcon />}
      {type === "error" && <XCircleIcon />}
      {type === "warning" && <ExclamationTriangleIcon />}
      {type === "info" && <ExclamationCircleIcon />}
    </div>
  )
}

export default Alert
