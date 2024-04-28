import { XMarkIcon } from "@heroicons/react/24/outline"
import Button from "components/atoms/button"
import { motion } from "framer-motion"

interface ModalProps {
  title: string
  onClose: () => void
  children?: React.ReactNode
}

const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      exit={{ opacity: 0 }}
    >
      <motion.div
        role="dialog"
        className="bg-white rounded-lg shadow-lg w-80 sm:w-96"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-row bg-white p-3 rounded-t-lg border-b border-gray-900/10 justify-between">
          <h2 className="font-semibold">{title}</h2>
          <Button status="secondary" size="sm" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

export default Modal
