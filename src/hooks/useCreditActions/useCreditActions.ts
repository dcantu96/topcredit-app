import { useRecoilCallback } from "recoil"

import { apiSelector } from "components/providers/api/atoms"
import { CreditStatus } from "src/schema.types"
import useToast from "components/providers/toaster/useToast"

export interface CreateCreditProps {
  userId: string
  loan: number
  termId: string
}

const SUCCESS_MESSAGES = new Map<CreditStatus, string>([
  ["new", "El usuario ha sido enviado a pre autorización"],
  ["pending", "El usuario ha enviado su solicitud de crédito"],
  ["invalid-documentation", "El usuario ha enviado documentación inválida"],
  ["authorized", "El usuario ha sido autorizado"],
  ["denied", "El usuario ha sido denegado"],
  ["dispersed", "El crédito ha sido dispersado"],
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

const useCreditActions = () => {
  const toast = useToast()

  const createCredit = useRecoilCallback(
    ({ snapshot }) =>
      async ({ loan, termId, userId }: CreateCreditProps) => {
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
            term: {
              data: {
                id: termId,
                type: "terms",
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
        try {
          await api.update(`credits`, { id: creditId, status, reason })
          const message = SUCCESS_MESSAGES.get(status)
          const defaultMessage = "Usuario actualizado"
          toast.success({
            title: "Usuario actualizado",
            message: message ?? defaultMessage,
          })
        } catch (error) {
          const defaultMessage = "Ocurrió un error al actualizar el crédito"
          const message = ERROR_MESSAGES.get(status)
          toast.error({
            title: "Error al actualizar",
            message: message ?? defaultMessage,
          })
        }
      },
  )
  return { createCredit, updateCreditStatus }
}

export default useCreditActions
