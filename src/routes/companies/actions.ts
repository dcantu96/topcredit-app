import { apiSelector } from "components/providers/api/atoms"
import { useRecoilCallback } from "recoil"
import {
  AssignTermForCompany,
  EditCompany,
  EditTerm,
  NewCompany,
  NewTerm,
} from "./atoms"
import { companySelectorQuery, companyState } from "./loader"

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
    ({ snapshot, refresh, reset }) =>
      async ({ id, domain, name, rate }: EditCompany) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        await api.update("company", {
          id,
          domain,
          name,
          rate,
        })
        refresh(companySelectorQuery(id.toString()))
        reset(companyState(id.toString()))
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
      async ({ name, durationType, duration }: NewTerm) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        const { data } = await api.create("term", {
          name,
          durationType,
          duration,
        })
        return data
      },
  )

  const assignTermToCompany = useRecoilCallback(
    ({ snapshot }) =>
      async ({ termId, companyId }: AssignTermForCompany) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        const companyResp = snapshot
          .getLoadable(companySelectorQuery(companyId.toString()))
          .getValue()
        const currentTerms = companyResp.terms.map((term) => ({
          id: term.id,
          type: "terms",
        }))
        await api.update("company", {
          id: companyId,
          terms: {
            data: [
              ...currentTerms,
              {
                id: termId,
                type: "terms",
              },
            ],
          },
        })
      },
  )

  const updateTerm = useRecoilCallback(
    ({ snapshot }) =>
      async ({ id, name, durationType, duration }: EditTerm) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        await api.update("term", {
          id,
          name,
          durationType,
          duration,
        })
      },
  )
  return {
    assignTermToCompany,
    createTerm,
    updateTerm,
  }
}
