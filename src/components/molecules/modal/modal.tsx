import { XMarkIcon } from "@heroicons/react/24/outline"
import Button from "components/atoms/button"
import { motion } from "framer-motion"

interface ModalProps {
  children?: React.ReactNode
}

const Modal = ({ children }: ModalProps) => {
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-8"
      exit={{ opacity: 0 }}
    >
      <motion.div
        role="dialog"
        className="bg-white rounded-lg shadow-lg w-full max-w-[800px]"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

const Body = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="max-h-96 overflow-y-auto overflow-x-auto rounded-b-lg">
      {children}
    </div>
  )
}

const Header = ({
  children,
  onClose,
  title,
}: {
  children?: React.ReactNode
  onClose: () => void
  title: string
}) => {
  return (
    <div className="flex flex-row bg-white p-3 rounded-t-lg border-b border-gray-900/10 justify-between">
      <h2 className="font-semibold">{title}</h2>
      <div className="flex gap-2">
        {children}
        <Button status="secondary" size="sm" onClick={onClose}>
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

Modal.Body = Body
Modal.Header = Header

export default Modal
