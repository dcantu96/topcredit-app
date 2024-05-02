import { notificationsSelector } from "components/organisms/activity-container/atoms"
import { useApi } from "components/providers/api/useApi"
import useToast from "components/providers/toaster/useToast"
import { useRecoilRefresher_UNSTABLE } from "recoil"

const SUCCESS_MESSAGES = new Map([
  ["pre-authorized", "El usuario ha sido enviado a pre autorización"],
  ["denied", "El usuario ha sido denegado"],
])

const ERROR_MESSAGES = new Map([
  ["pre-authorized", "Ocurrió un error al enviar a pre autorización"],
  ["denied", "Ocurrió un error al denegar el usuario"],
])

const useUserActions = (id: string) => {
  const refreshNotifications = useRecoilRefresher_UNSTABLE(
    notificationsSelector(["PreAuthorizations"]),
  )
  const toast = useToast()
  const api = useApi()

  const updateUserStatus = async (newStatus: "pre-authorized" | "denied") => {
    try {
      await api.update(`users`, { id, status: newStatus })
      const message = SUCCESS_MESSAGES.get(newStatus)
      const defaultMessage = "Usuario actualizado"
      toast.success({
        title: "Usuario actualizado",
        message: message ?? defaultMessage,
      })
      refreshNotifications()
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

export default useUserActions
