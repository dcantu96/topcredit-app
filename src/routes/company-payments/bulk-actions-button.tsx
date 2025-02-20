import { useState } from "react"
import { useRecoilValue, useRecoilCallback } from "recoil"

import Button from "components/atoms/button"
import ImportDocumentModal from "components/organisms/import-document-modal"
import Dialog from "components/molecules/dialog"
import { apiSelector } from "components/providers/api/atoms"
import useToast from "components/providers/toaster/useToast"

import { companyCreditsDetailedWithPaymentsState } from "../../services/companies/atoms"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedCredits = useRecoilValue(
    selectedInstalledCreditWithPaymentsIdsState(companyId),
  )
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const downloadTemplate = () => {
    const headers = [
      "Empleado",
      "Cliente",
      "Año",
      "Mes",
      "Quincena",
      "Descuento",
    ]
    exportToCSV(
      headers,
      [["JP3424", "Soriana", "2025", "01", "1", "100.59"]],
      "pagos.csv",
    )
  }

  const handleRegisterPayments = useRecoilCallback(
    ({ snapshot, set, reset }) =>
      async () => {
        const api = await snapshot.getPromise(apiSelector)
        const credits = await snapshot.getPromise(
          companyCreditsDetailedWithPaymentsState(companyId),
        )
        const selectedCredits = await snapshot.getPromise(
          selectedInstalledCreditWithPaymentsIdsState(companyId),
        )

        for (const creditId of selectedCredits) {
          const credit = credits?.find((credit) => credit.id === creditId)
          if (!credit || !credit.amortization) continue
          const paymentNumbers = credit.payments
            .map((payment) => payment.number)
            .toSorted()
          const lastPaymentNumber = paymentNumbers[paymentNumbers.length - 1]
          const resp = await api.create("payments", {
            credit: {
              data: {
                id: creditId,
                type: "credits",
              },
            },
            amount: credit.amortization,
            paidAt: new Date().toISOString(),
            number: lastPaymentNumber + 1,
          })
          reset(installedCreditWithPaymentSelectedState(creditId))
          set(
            companyCreditsDetailedWithPaymentsState(companyId),
            (oldCredits) => {
              return (
                oldCredits?.map((credit) => {
                  if (credit.id === creditId) {
                    return {
                      ...credit,
                      payments: [
                        ...credit.payments,
                        {
                          id: resp.data.id,
                          amount: resp.data.amount,
                          paidAt: resp.data.paidAt,
                          number: resp.data.number,
                          expectedAt: resp.data.expectedAt,
                          expectedAmount: resp.data.expectedAmount,
                        },
                      ],
                    }
                  } else {
                    return credit
                  }
                }) ?? []
              )
            },
          )
        }

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
      <ImportDocumentModal />
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
            if (input === "registrar") await handleRegisterPayments()
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
