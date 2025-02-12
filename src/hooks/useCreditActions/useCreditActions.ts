import { useRecoilCallback } from "recoil"

import { apiSelector } from "components/providers/api/atoms"
import { CreditStatus, HRStatus } from "src/schema.types"
import useToast from "components/providers/toaster/useToast"
import {
  authorizationRejectionReasonCreditState,
  authorizationStatusCreditState,
  contractRejectionReasonCreditState,
  contractStatusCreditState,
  payrollReceiptRejectionReasonCreditState,
  payrollReceiptStatusCreditState,
} from "../../routes/pending-authorizations/atoms"
import { editableDispersionReceiptFieldState } from "../../routes/dispersions/atoms"
import {
  hrCreditsSelector,
  hrCreditsSelectorQuery,
} from "../../routes/hr/atoms"

export interface CreateCreditProps {
  userId: string
  loan: number
  termOfferingId: string
}

const SUCCESS_MESSAGES = new Map<CreditStatus, string>([
  ["new", "El usuario ha sido enviado a pre autorización"],
  ["pending", "El usuario ha enviado su solicitud de crédito"],
  ["invalid-documentation", "El usuario ha enviado documentación inválida"],
  ["authorized", "El usuario ha sido autorizado"],
  ["denied", "El usuario ha sido denegado"],
  ["dispersed", "El crédito ha sido dispersado"],
])

const HR_SUCCESS_MESSAGES = new Map<HRStatus, string>([
  ["approved", "El usuario ha sido aprobado por recursos humanos"],
  ["denied", "El usuario ha sido rechazado"],
])

const HR_ERROR_MESSAGES = new Map<HRStatus, string>([
  ["approved", "Ocurrió un error al aprobar al usuario"],
  ["denied", "Ocurrió un error al rechazar al usuario"],
])

const ERROR_MESSAGES = new Map([
  ["new", "Ocurrió un error al enviar a pre autorización"],
  ["pending", "Ocurrió un error al enviar la solicitud de crédito"],
  [
    "invalid-documentation",
    "Ocurrió un error al enviar documentación inválida",
  ],
  ["authorized", "Ocurrió un error al autorizar el usuario"],
  ["denied", "Ocurrió un error al denegar el usuario"],
  ["dispersed", "Ocurrió un error al dispersar el crédito"],
])

type CreditDocumentKind = "authorization" | "contract" | "payrollReceipt"

const useCreditActions = () => {
  const toast = useToast()

  const createCredit = useRecoilCallback(
    ({ snapshot }) =>
      async ({ loan, termOfferingId, userId }: CreateCreditProps) => {
        const api = await snapshot.getPromise(apiSelector)
        try {
          await api.create("credits", {
            loan,
            status: "new",
            borrower: {
              data: {
                id: userId,
                type: "users",
              },
            },
            termOffering: {
              data: {
                id: termOfferingId,
                type: "termOfferings",
              },
            },
          })
        } catch (error) {
          console.error(error)
        }
      },
  )

  const updateCreditStatus = useRecoilCallback(
    ({ snapshot }) =>
      async (creditId: string, status: CreditStatus, reason?: string) => {
        const api = await snapshot.getPromise(apiSelector)
        const authorizationStatus = await snapshot.getPromise(
          authorizationStatusCreditState(creditId),
        )
        const authorizationRejectionReason = await snapshot.getPromise(
          authorizationRejectionReasonCreditState(creditId),
        )
        const contractStatus = await snapshot.getPromise(
          contractStatusCreditState(creditId),
        )
        const contractRejectionReason = await snapshot.getPromise(
          contractRejectionReasonCreditState(creditId),
        )
        const payrollReceiptStatus = await snapshot.getPromise(
          payrollReceiptStatusCreditState(creditId),
        )
        const payrollReceiptRejectionReason = await snapshot.getPromise(
          payrollReceiptRejectionReasonCreditState(creditId),
        )
        const dispersionReceipt = snapshot
          .getLoadable(editableDispersionReceiptFieldState(creditId))
          .getValue()
        try {
          await api.update(`credits`, {
            id: creditId,
            dispersedAt:
              status === "dispersed" ? new Date().toISOString() : null,
            status,
            reason,
            authorizationStatus,
            authorizationRejectionReason,
            contractStatus,
            contractRejectionReason,
            payrollReceiptStatus,
            payrollReceiptRejectionReason,
            dispersionReceipt,
          })
          const message = SUCCESS_MESSAGES.get(status)
          const defaultMessage = "Usuario actualizado"
          toast.success({
            title: "Usuario actualizado",
            message: message ?? defaultMessage,
          })
        } catch {
          const defaultMessage = "Ocurrió un error al actualizar el crédito"
          const message = ERROR_MESSAGES.get(status)
          toast.error({
            title: "Error al actualizar",
            message: message ?? defaultMessage,
          })
        }
      },
  )

  const updateHRStatus = useRecoilCallback(
    ({ snapshot, refresh }) =>
      async (creditId: string, status: HRStatus) => {
        const api = await snapshot.getPromise(apiSelector)
        try {
          await api.update(`credits`, {
            id: creditId,
            hrStatus: status,
          })
          const message = HR_SUCCESS_MESSAGES.get(status)
          const defaultMessage = "Usuario actualizado"
          toast.success({
            title: "Usuario actualizado",
            message: message ?? defaultMessage,
          })
          refresh(hrCreditsSelectorQuery("all"))
          refresh(hrCreditsSelectorQuery("approved"))
          refresh(hrCreditsSelectorQuery("denied"))
          refresh(hrCreditsSelectorQuery("pending"))
          refresh(hrCreditsSelector(creditId))
          // update all states
        } catch {
          const defaultMessage = "Ocurrió un error al actualizar el crédito"
          const message = HR_ERROR_MESSAGES.get(status)
          toast.error({
            title: "Error al actualizar",
            message: message ?? defaultMessage,
          })
        }
      },
  )

  const approveDocument = useRecoilCallback(
    ({ set }) =>
      (creditId: string, documentKind: CreditDocumentKind) =>
      () => {
        if (documentKind === "authorization") {
          set(authorizationStatusCreditState(creditId), "approved")
          set(authorizationRejectionReasonCreditState(creditId), null)
        } else if (documentKind === "contract") {
          set(contractStatusCreditState(creditId), "approved")
          set(contractRejectionReasonCreditState(creditId), null)
        } else {
          set(payrollReceiptStatusCreditState(creditId), "approved")
          set(payrollReceiptRejectionReasonCreditState(creditId), null)
        }
      },
  )

  const denyDocument = useRecoilCallback(
    ({ set }) =>
      (creditId: string, documentKind: CreditDocumentKind) =>
      (reason: string) => {
        if (documentKind === "authorization") {
          set(authorizationStatusCreditState(creditId), "rejected")
          set(authorizationRejectionReasonCreditState(creditId), reason)
        } else if (documentKind === "contract") {
          set(contractStatusCreditState(creditId), "rejected")
          set(contractRejectionReasonCreditState(creditId), reason)
        } else {
          set(payrollReceiptStatusCreditState(creditId), "rejected")
          set(payrollReceiptRejectionReasonCreditState(creditId), reason)
        }
      },
  )

  return {
    createCredit,
    updateCreditStatus,
    approveDocument,
    denyDocument,
    updateHRStatus,
  }
}

export default useCreditActions
