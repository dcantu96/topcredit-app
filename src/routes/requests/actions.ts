import { useNavigate } from "react-router-dom"
import { useApi } from "components/providers/api/useApi"
import useToast from "components/providers/toaster/useToast"
import {
  bankStatementRejectionReasonState,
  bankStatementStatusState,
  basicDetailsSortedSelector,
  identityDocumentRejectionReasonState,
  identityDocumentStatusState,
  payrollReceiptRejectionReasonState,
  payrollReceiptStatusState,
  proofOfAddressRejectionReasonState,
  proofOfAddressStatusState,
} from "./atoms"
import { notificationsSelector } from "components/organisms/activity-container/atoms"
import { useRecoilRefresher_UNSTABLE, useRecoilState } from "recoil"
import { isJsonApiError } from "components/providers/api/utils"

export const useRequestActions = (id: number) => {
  const [bankStatementStatus, setBankStatementStatus] = useRecoilState(
    bankStatementStatusState(Number(id)),
  )
  const [bankStatementRejectionReason, setBankStatementRejectionReason] =
    useRecoilState(bankStatementRejectionReasonState(Number(id)))
  const [proofOfAddressStatus, setProofOfAddressStatus] = useRecoilState(
    proofOfAddressStatusState(Number(id)),
  )
  const [proofOfAddressRejectionReason, setProofOfAddressRejectionReason] =
    useRecoilState(proofOfAddressRejectionReasonState(Number(id)))
  const [identityDocumentStatus, setIdentityDocumentStatus] = useRecoilState(
    identityDocumentStatusState(Number(id)),
  )
  const [identityDocumentRejectionReason, setIdentityDocumentRejectionReason] =
    useRecoilState(identityDocumentRejectionReasonState(Number(id)))
  const [payrollReceiptStatus, setPayrollReceiptStatus] = useRecoilState(
    payrollReceiptStatusState(Number(id)),
  )
  const [payrollReceiptRejectionReason, setPayrollReceiptRejectionReason] =
    useRecoilState(payrollReceiptRejectionReasonState(Number(id)))
  const navigate = useNavigate()
  const refresh = useRecoilRefresher_UNSTABLE(basicDetailsSortedSelector)
  const refreshNotifications = useRecoilRefresher_UNSTABLE(
    notificationsSelector("RequestsNotifier"),
  )
  const toast = useToast()
  const api = useApi()

  const approveUser = async () => {
    try {
      await api.update(`users`, {
        id,
        status: "pre-authorization",
        identityDocumentStatus,
        proofOfAddressStatus,
        payrollReceiptStatus,
        bankStatementStatus,
      })
      toast.success({
        title: "Usuario actualizado",
        message: "El usuario ha sido aprobado",
      })
      refresh()
      refreshNotifications()
      navigate("/dashboard/requests")
    } catch (error) {
      let message = "Ocurrió un error al actualizar el usuario"
      if (isJsonApiError(error)) message = error.errors[0].title
      toast.error({
        title: "Error al actualizar el usuario",
        message,
      })
    }
  }

  const denyUser = async () => {
    try {
      await api.update(`users`, { id, status: "denied" })
      toast.success({
        title: "Usuario actualizado",
        message: "El usuario ha sido denegado",
      })
      refresh()
      refreshNotifications()
      navigate("/dashboard/requests")
    } catch (error) {
      let message = "Ocurrió un error al actualizar el usuario"
      if (isJsonApiError(error)) message = error.errors[0].title
      toast.error({
        title: "Error al actualizar el usuario",
        message,
      })
    }
  }

  const missingDocumentation = async () => {
    try {
      await api.update(`users`, {
        id,
        status: "invalid-documentation",
        identityDocumentStatus,
        proofOfAddressStatus,
        payrollReceiptStatus,
        bankStatementStatus,
        identityDocumentRejectionReason,
        proofOfAddressRejectionReason,
        payrollReceiptRejectionReason,
        bankStatementRejectionReason,
      })
      toast.success({
        title: "Usuario actualizado",
        message: "El usuario ha sido marcado como falta de documentación",
      })
      refresh()
      refreshNotifications()
      navigate("/dashboard/requests")
    } catch (error) {
      let message = "Ocurrió un error al actualizar el usuario"
      if (isJsonApiError(error)) message = error.errors[0].title
      toast.error({
        title: "Error al actualizar el usuario",
        message,
      })
    }
  }

  const approveDocument =
    (
      documentKind:
        | "identityDocument"
        | "proofOfAddress"
        | "payrollReceipt"
        | "bankStatement",
    ) =>
    () => {
      if (documentKind === "identityDocument") {
        setIdentityDocumentStatus("approved")
        setIdentityDocumentRejectionReason(null)
      } else if (documentKind === "proofOfAddress") {
        setProofOfAddressStatus("approved")
        setProofOfAddressRejectionReason(null)
      } else if (documentKind === "payrollReceipt") {
        setPayrollReceiptStatus("approved")
        setPayrollReceiptRejectionReason(null)
      } else if (documentKind === "bankStatement") {
        setBankStatementStatus("approved")
        setBankStatementRejectionReason(null)
      }
    }

  const denyDocument =
    (
      documentKind:
        | "identityDocument"
        | "proofOfAddress"
        | "payrollReceipt"
        | "bankStatement",
    ) =>
    (reason: string) => {
      if (documentKind === "identityDocument") {
        setIdentityDocumentStatus("rejected")
        setIdentityDocumentRejectionReason(reason)
      } else if (documentKind === "proofOfAddress") {
        setProofOfAddressStatus("rejected")
        setProofOfAddressRejectionReason(reason)
      } else if (documentKind === "payrollReceipt") {
        setPayrollReceiptStatus("rejected")
        setPayrollReceiptRejectionReason(reason)
      } else if (documentKind === "bankStatement") {
        setBankStatementStatus("rejected")
        setBankStatementRejectionReason(reason)
      }
    }

  return {
    approveUser,
    denyUser,
    missingDocumentation,
    approveDocument,
    denyDocument,
  }
}
