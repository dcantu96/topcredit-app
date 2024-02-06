import { useNavigate } from "react-router-dom"
import { useApi } from "components/providers/api/useApi"
import useToast from "components/providers/toaster/useToast"
import { basicDetailsSortedSelector } from "./atoms"
import { useRecoilRefresher_UNSTABLE } from "recoil"

export const useRequestActions = (id: number) => {
  const navigate = useNavigate()
  const refresh = useRecoilRefresher_UNSTABLE(basicDetailsSortedSelector)
  const toast = useToast()
  const api = useApi()

  const approveUser = async () => {
    try {
      await api.update(`users`, { id, status: "approved" })
      toast.success({
        title: "Usuario actualizado",
        message: "El usuario ha sido aprobado",
      })
      refresh()
      navigate("/requests")
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
      navigate("/requests")
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
  }
}

export const isJsonApiError = (error: unknown): error is JsonApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray(error.errors)
  )
}

export interface JsonApiError {
  errors: JsonApiErrorItem[]
}

export interface JsonApiErrorItem {
  title: string
  detail: string
  source: JsonApiErrorSource
  code: string
  status: string
}

export interface JsonApiErrorSource {
  pointer: string
  parameter?: string
}
