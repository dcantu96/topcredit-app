import useToast from "components/providers/toaster/useToast"
import { useState } from "react"
import { selectedCompletedCreditsIdsState } from "./atoms"
import { useRecoilCallback, useRecoilValue } from "recoil"
import { apiSelector } from "components/providers/api/atoms"
import Modal from "components/molecules/modal"
import Button from "components/atoms/button"

interface BulkActionsProps {
  companyId: string
}

const BulkActions = ({ companyId }: BulkActionsProps) => {
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedCredits = useRecoilValue(
    selectedCompletedCreditsIdsState(companyId),
  )
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleCompleteCredits = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const api = await snapshot.getPromise(apiSelector)

        for (const creditId of selectedCredits) {
          await api.update("credits", {
            id: creditId,
            status: "finished",
          })
        }

        toast.success({
          title: "Créditos actualizados",
          message: "se han marcado como terminados",
        })
        closeModal()
      },
    [companyId],
  )

  if (!selectedCredits.length) return null
  return (
    <>
      <Button size="sm" onClick={openModal}>
        Baja ({selectedCredits.length})
      </Button>
      {isModalOpen ? (
        <Modal>
          <Modal.Header onClose={closeModal} title="Dar de baja" />
          <Modal.Body>
            <p className="text-sm text-gray-500 p-3">
              Al continuar vas a marcar <b>{selectedCredits.length}</b> créditos
              como <b>terminados</b>
            </p>
            <div className="flex justify-end p-3 gap-2">
              <Button onClick={closeModal} status="secondary" fullWidth>
                Cancelar
              </Button>
              <Button onClick={handleCompleteCredits} fullWidth>
                Confirmar
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      ) : null}
    </>
  )
}

export default BulkActions
