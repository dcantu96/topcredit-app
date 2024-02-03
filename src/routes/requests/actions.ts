import { useParams } from "react-router-dom"
import { useApi } from "components/providers/api/useApi"

export const useRequestActions = () => {
  const { id } = useParams()
  const api = useApi()
  if (!id || Number.isNaN(id)) throw new Error("Missing user id")

  const approveUser = async () => {
    const response = await api.update(`users`, { id, status: "hi" })
    console.log(response)
  }

  const denyUser = async () => {
    const response = await api.update(`users`, { id, status: "denied" })
    console.log(response)
  }

  return {
    approveUser,
    denyUser,
  }
}
