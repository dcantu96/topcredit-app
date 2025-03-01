import { Suspense, useState } from "react"
import { useRecoilValue, useRecoilCallback } from "recoil"

import Button from "components/atoms/button"
import ImportDocumentModal from "components/organisms/import-document-modal"
import Dialog from "components/molecules/dialog"
import { apiSelector } from "components/providers/api/atoms"
import useToast from "components/providers/toaster/useToast"

import { companyCreditsDetailedWithPaymentsSelector } from "../../services/companies/atoms"
import {
  selectedInstalledCreditWithPaymentsIdsState,
  installedCreditWithPaymentSelectedState,
} from "./atoms"
import { CloudArrowDownIcon } from "@heroicons/react/24/solid"
import { exportToCSV } from "../../utils"

interface BulkActionsButtonProps {
  companyId: string
}

const BulkActionsButton = ({ companyId }: BulkActionsButtonProps) => {
  const toast = useToast()
  if (!companyId) throw new Error("companyId is required")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedCredits = useRecoilValue(
    selectedInstalledCreditWithPaymentsIdsState(companyId),
  )
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const downloadTemplate = () => {
    const headers = ["Empleado", "Cliente", "Descuento"]
    exportToCSV(headers, [["JP3424", "Soriana", "100.59"]], "pagos.csv")
  }

  const handleUpdatePayments = useRecoilCallback(
    ({ snapshot, refresh, reset }) =>
      async () => {
        const api = await snapshot.getPromise(apiSelector)
        const credits = await snapshot.getPromise(
          companyCreditsDetailedWithPaymentsSelector(companyId),
        )
        const selectedCredits = await snapshot.getPromise(
          selectedInstalledCreditWithPaymentsIdsState(companyId),
        )

        for (const creditId of selectedCredits) {
          const credit = credits?.find((credit) => credit.id === creditId)
          if (!credit || !credit.amortization) continue

          const nextPayment = credit.payments
            .toSorted((a, b) => a.number - b.number)
            .find((payment) => !payment.paidAt)

          if (!nextPayment) continue

          await api.update("payments", {
            id: nextPayment.id,
            amount: credit.amortization,
            paidAt: new Date().toISOString(),
          })
          reset(installedCreditWithPaymentSelectedState(creditId))
        }

        refresh(companyCreditsDetailedWithPaymentsSelector(companyId))

        toast.success({
          title: "Pagos registrados",
          message: "se han instalado los créditos seleccionados",
        })
        closeModal()
      },
    [companyId],
  )

  const modalMessage = `Esto registrará el pago para ${selectedCredits.length} créditos. ¿Estás seguro? Una vez instalados no podrás deshacer esta acción.`

  return (
    <>
      <Suspense fallback={null}>
        <ImportDocumentModal companyId={companyId} />
      </Suspense>
      {selectedCredits.length ? (
        <Button size="sm" onClick={openModal}>
          Registrar pagos ({selectedCredits.length})
        </Button>
      ) : null}
      <Button size="sm" onClick={downloadTemplate}>
        Descargar Formato
        <CloudArrowDownIcon className="h-4 w-4 ml-1" />
      </Button>
      {isModalOpen ? (
        <Dialog
          message={modalMessage}
          onCancel={closeModal}
          onClose={async (input) => {
            if (input === "registrar") await handleUpdatePayments()
          }}
          title="Registrar pagos"
          inputLabel="Escribe 'registrar' para confirmar"
          type="danger"
        />
      ) : null}
    </>
  )
}

export default BulkActionsButton
