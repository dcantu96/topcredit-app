import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import Button from "components/atoms/button"
import { motion } from "framer-motion"

interface BaseDialogProps {
  title: string
  message: string
  type: "danger" | "notice"
  onClose: () => void
}

interface DangerDialogProps extends BaseDialogProps {
  type: "danger"
  onCancel: () => void
  cancelText?: string
  confirmText?: string
}

interface NoticeDialogProps extends BaseDialogProps {
  type: "notice"
  confirmText?: string
}

type DialogProps = DangerDialogProps | NoticeDialogProps

const Dialog = ({ message, title, ...rest }: DialogProps) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      exit={{ opacity: 0 }}
    >
      <motion.div
        role="dialog"
        className="bg-white rounded-lg shadow-lg w-80 sm:w-96"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* icon */}
        <div className="flex flex-row bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-t-lg">
          <div className="block mr-3">
            <DialogIcon type={rest.type} />
          </div>
          {/* container with title and message */}
          <div className="block text-left">
            <h4 className="text-gray-900 font-semibold text-base leading-6">
              {title}
            </h4>
            <div className="mt-2">
              <p className="text-gray-500 font-normal text-sm">{message}</p>
            </div>
          </div>
        </div>
        {/* close button */}
        <div
          className={`flex flex-row justify-end gap-4 px-4 py-3 rounded-b-lg ${
            rest.type === "danger" ? "bg-gray-50" : ""
          }`}
        >
          {rest.type === "danger" ? (
            <>
              <Button type="button" status="secondary" onClick={rest.onCancel}>
                {rest.cancelText ?? "Cancelar"}
              </Button>
              <Button type="button" variant="danger" onClick={rest.onClose}>
                {rest.confirmText ?? "Aceptar"}
              </Button>
            </>
          ) : (
            <Button type="button" status="secondary" onClick={rest.onClose}>
              {rest.confirmText ?? "Aceptar"}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

const DialogIcon = ({ type }: { type: DialogProps["type"] }) => {
  return (
    <div
      className={`p-2 rounded-full ${
        type === "danger" ? "bg-red-100" : "bg-green-100"
      }`}
    >
      {type === "danger" ? (
        <ExclamationTriangleIcon className="text-red-600 w-6 h-6" />
      ) : (
        <CheckIcon className="text-green-400 w-6 h-6" />
      )}
    </div>
  )
}

export default Dialog
