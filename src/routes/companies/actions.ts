import { apiSelector } from "components/providers/api/atoms"
import { useRecoilCallback } from "recoil"
import {
  EditCompany,
  EditTerm,
  NewCompany,
  NewTerm,
  NewTermForCompany,
} from "./atoms"
import { companySelectorQuery } from "./loader"

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
      async ({ name, durationType, duration }: NewTerm) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        const resp = await api.create("term", {
          name,
          durationType,
          duration,
        })
        return resp
      },
  )

  const assignTermToCompany = useRecoilCallback(
    ({ snapshot }) =>
      async ({
        name,
        durationType,
        duration,
        companyId,
      }: NewTermForCompany) => {
        const termResp = await createTerm({ name, durationType, duration })

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
                id: termResp.data.id,
                type: "terms",
              },
            ],
          },
        })
        return {
          id: termResp.data.id,
          name,
          durationType,
          duration,
        }
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
