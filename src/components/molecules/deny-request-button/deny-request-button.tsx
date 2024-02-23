import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { XMarkIcon } from "@heroicons/react/24/solid"

import Button from "components/atoms/button"
import Dialog from "../dialog"
import { useRequestActions } from "routes/requests/actions"

const DenyRequestButton = ({ id }: { id: number }) => {
  const { denyUser } = useRequestActions(id)
  const [isModalOpen, setModalOpen] = useState(false)
  const showModal = () => setModalOpen(true)

  const handleDeny = () => {
    denyUser()
    setModalOpen(false)
  }

  return (
    <>
      <Button size="sm" variant="danger" onClick={showModal}>
        <XMarkIcon className="w-4 h-4 text-white p-0" />
      </Button>
      <AnimatePresence>
        {isModalOpen && (
          <Dialog
            onClose={handleDeny}
            onCancel={() => setModalOpen(false)}
            type="danger"
            title="Rechazar solicitud"
            message="¿Estás seguro de que deseas rechazar esta solicitud? Esto va a cancelar el proceso de registro del usuario."
            confirmText="Rechazar"
            cancelText="Cancelar"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default DenyRequestButton
