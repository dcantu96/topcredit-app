import { useRecoilCallback } from "recoil"

import { useApi } from "components/providers/api/useApi"
import useToast from "components/providers/toaster/useToast"
import { apiSelector } from "components/providers/api/atoms"
import { preAuthorizationUsersState } from "./atoms"

const SUCCESS_MESSAGES = new Map([
  ["pre-authorized", "El usuario ha sido enviado a pre autorización"],
  ["denied", "El usuario ha sido denegado"],
])

const ERROR_MESSAGES = new Map([
  ["pre-authorized", "Ocurrió un error al enviar a pre autorización"],
  ["denied", "Ocurrió un error al denegar el usuario"],
])

export const useUserActions = (id: string) => {
  const toast = useToast()
  const api = useApi()

  const updateUserStatus = async (newStatus: "pre-authorized" | "denied") => {
    try {
      await api.update(`users`, { id, status: newStatus })
      const message = SUCCESS_MESSAGES.get(newStatus)
      if (!message) return
      toast.success({
        title: "Usuario actualizado",
        message,
      })
    } catch (error) {
      const defaultMessage = "Ocurrió un error al actualizar el usuario"
      const message = ERROR_MESSAGES.get(newStatus)
      toast.error({
        title: "Error al actualizar",
        message: message ?? defaultMessage,
      })
    }
  }

  return {
    updateUserStatus,
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

export const usePreAuthorizationActions = () => {
  const removeUser = useRecoilCallback(({ set }) => async (userId: string) => {
    set(preAuthorizationUsersState, (users) =>
      users.filter((user) => user.id !== userId),
    )
  })

  return {
    removeUser,
  }
}
