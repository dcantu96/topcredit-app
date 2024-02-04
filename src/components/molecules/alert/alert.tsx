import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"

interface AlertProps {
  title: string
  message: string
  type: "success" | "error" | "warning" | "info"
  onClose?: () => void
}

const Alert = ({ type, message, title, onClose }: AlertProps) => {
  return (
    <motion.div
      role="alert"
      className="flex flex-row bg-white rounded-md shadow-lg p-4 w-80 sm:w-96"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* icon */}
      <div className="block mr-3">
        <AlertIcon type={type} />
      </div>
      {/* container with title and message */}
      <div className="block mr-auto">
        <h4 className="text-gray-900 font-medium text-sm">{title}</h4>
        <p className="text-gray-500 font-normal text-sm mt-1">{message}</p>
      </div>
      {/* close button */}
      <div className="block">
        <button
          onClick={onClose}
          className="bg-transparent border-none rounded-md p-1"
          aria-label="Close"
        >
          <XMarkIcon className="text-gray-400 hover:text-gray-500 h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )
}

const AlertIcon = ({ type }: { type: AlertProps["type"] }) => {
  return (
    <div className="icon">
      {type === "success" && (
        <CheckCircleIcon className="text-green-400 w-6 h-6" />
      )}
      {type === "error" && <XCircleIcon className="text-rose-500 w-6 h-6" />}
      {type === "warning" && (
        <ExclamationTriangleIcon className="text-orange-400 w-6 h-6" />
      )}
      {type === "info" && (
        <ExclamationCircleIcon className="text-blue-400 w-6 h-6" />
      )}
    </div>
  )
}

export default Alert
