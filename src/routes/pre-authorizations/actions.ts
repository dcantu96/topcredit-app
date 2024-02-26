import { useRecoilCallback } from "recoil"

import { useApi } from "components/providers/api/useApi"
import useToast from "components/providers/toaster/useToast"
import { isJsonApiError } from "components/providers/api/utils"
import { apiSelector } from "components/providers/api/atoms"

export const useUserActions = (id: string) => {
  const toast = useToast()
  const api = useApi()

  const updateUserStatus = async (newStatus: string) => {
    try {
      await api.update(`users`, { id, status: newStatus })
      toast.success({
        title: "Usuario actualizado",
        message: "El usuario ha sido enviado a pre autorización",
      })
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
    } catch (error) {
      let message = "Ocurrió un error al actualizar el usuario"
      if (isJsonApiError(error)) message = error.errors[0].title
      toast.error({
        title: "Error al actualizar el usuario",
        message,
      })
    }
  }

  return {
    updateUserStatus,
    denyUser,
  }
}

export interface CreateCreditProps {
  userId: string
  loan: number
  termId: string
}

export const useCreditActions = () => {
  const createCredit = useRecoilCallback(
    ({ snapshot }) =>
      async ({ loan, termId, userId }: CreateCreditProps) => {
        const api = await snapshot.getPromise(apiSelector)
        try {
          await api.create("credits", {
            loan,
            status: "pre-authorized",
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
  return { createCredit }
}
