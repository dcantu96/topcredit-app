import Alert from "components/molecules/alert"
import useToast from "./useToast"
import { createPortal } from "react-dom"
import { AnimatePresence } from "framer-motion"

const Toaster = () => {
  const { toast, dismiss } = useToast()

  return createPortal(
    <AnimatePresence>
      {toast ? (
        <ToasterContainer>
          <Alert
            type={toast.status}
            message={toast.message}
            title={toast.title}
            onClose={dismiss}
          />
        </ToasterContainer>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

interface ToasterContainerProps {
  children: React.ReactNode
}

const ToasterContainer = ({ children }: ToasterContainerProps) => {
  return <div className="fixed top-0 right-0 z-50 p-4">{children}</div>
}

export default Toaster
