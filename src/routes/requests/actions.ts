import { useNavigate } from "react-router-dom"
import { useApi } from "components/providers/api/useApi"
import useToast from "components/providers/toaster/useToast"
import { basicDetailsSortedSelector } from "./atoms"
import { useRecoilRefresher_UNSTABLE } from "recoil"
import { isJsonApiError } from "components/providers/api/utils"

export const useRequestActions = (id: number) => {
  const navigate = useNavigate()
  const refresh = useRecoilRefresher_UNSTABLE(basicDetailsSortedSelector)
  const toast = useToast()
  const api = useApi()

  const approveUser = async () => {
    try {
      await api.update(`users`, { id, status: "pre-authorization" })
      toast.success({
        title: "Usuario actualizado",
        message: "El usuario ha sido aprobado",
      })
      refresh()
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

  const missingDocumentation = async (reason: string) => {
    try {
      await api.update(`users`, { id, status: "invalid-documentation", reason })
      toast.success({
        title: "Usuario actualizado",
        message: "El usuario ha sido marcado como falta de documentación",
      })
      refresh()
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

  return {
    approveUser,
    denyUser,
    missingDocumentation,
  }
}
