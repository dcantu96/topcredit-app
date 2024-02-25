import { apiSelector } from "components/providers/api/atoms"
import { useRecoilCallback } from "recoil"
import { EditCompany, EditTerm, NewCompany, NewTerm } from "./atoms"

export const useCompanyActions = () => {
  const createCompany = useRecoilCallback(
    ({ snapshot }) =>
      async ({ domain, name, rate, terms }: NewCompany) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        await api.create("company", {
          domain,
          name,
          rate,
          terms,
        })
      },
  )
  const updateCompany = useRecoilCallback(
    ({ snapshot }) =>
      async ({ id, domain, name, rate, terms }: EditCompany) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        await api.update("company", {
          id,
          domain,
          name,
          rate,
          terms,
        })
      },
  )
  return {
    createCompany,
    updateCompany,
  }
}

export const useTermActions = () => {
  const createTerm = useRecoilCallback(
    ({ snapshot }) =>
      async ({ name, type, duration }: NewTerm) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        await api.create("term", {
          name,
          type,
          duration,
        })
      },
  )
  const updateTerm = useRecoilCallback(
    ({ snapshot }) =>
      async ({ id, name, type, duration }: EditTerm) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        await api.update("term", {
          id,
          name,
          type,
          duration,
        })
      },
  )
  return {
    createTerm,
    updateTerm,
  }
}
