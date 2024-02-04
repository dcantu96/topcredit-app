import { useNavigate, useParams } from "react-router-dom"
import { useApi } from "components/providers/api/useApi"
import useToast from "components/providers/toaster/useToast"

export const useRequestActions = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const api = useApi()
  if (!id || Number.isNaN(id)) throw new Error("Missing user id")

  const approveUser = async () => {
    try {
      await api.update(`users`, { id, status: "approved" })
      toast.success({
        title: "Usuario actualizado",
        message: "El usuario ha sido aprobado",
      })
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
