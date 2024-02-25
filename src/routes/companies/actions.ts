import { apiSelector } from "components/providers/api/atoms"
import { useRecoilCallback } from "recoil"
import {
  AssignTermForCompany,
  EditCompany,
  EditTerm,
  NewCompany,
  NewTerm,
  termsState,
} from "./atoms"
import { companiesState, companySelectorQuery, companyState } from "./loader"

export const useCompanyActions = () => {
  const { isCompaniesListSet } = useCompaniesActions()
  const createCompany = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ domain, name, rate }: NewCompany) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        const { data } = await api.create("company", {
          domain,
          name,
          rate,
        })
        if (!isCompaniesListSet()) return
        set(companiesState, (prev) => [
          ...prev,
          {
            domain,
            name,
            rate: rate ?? null,
            terms: [],
            id: data.id,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          },
        ])
      },
  )
  const updateCompany = useRecoilCallback(
    ({ snapshot, refresh, set }) =>
      async ({ id, domain, name, rate }: EditCompany) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        await api.update("company", {
          id,
          domain,
          name,
          rate,
        })
        refresh(companySelectorQuery(id))
        set(companyState(id), (prev) => ({
          ...prev,
          domain: domain ?? null,
          rate: rate ?? null,
        }))
        if (!isCompaniesListSet()) return
        set(companiesState, (prev) =>
          prev.map((prevCompany) => {
            if (prevCompany.id === id) {
              return {
                ...prevCompany,
                domain: domain ?? null,
                rate: rate ?? null,
              }
            }
            return prevCompany
          }),
        )
      },
  )
  return {
    createCompany,
    updateCompany,
  }
}

export const useCompaniesActions = () => {
  const isCompaniesListSet = useRecoilCallback(({ snapshot }) => () => {
    return snapshot.getInfo_UNSTABLE(companiesState).isSet
  })
  return {
    isCompaniesListSet,
  }
}

export const useTermActions = () => {
  const { isCompaniesListSet } = useCompaniesActions()
  const createTerm = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ name, durationType, duration }: NewTerm) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        const { data } = await api.create("term", {
          name,
          durationType,
          duration,
        })
        set(termsState, (prev) => new Map(prev).set(data.id, data))
        return data
      },
  )

  const assignTermToCompany = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ termId, companyId }: AssignTermForCompany) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        const company = snapshot.getLoadable(companyState(companyId)).getValue()
        const termMap = snapshot.getLoadable(termsState).getValue()
        const termToAssign = termMap.get(termId)
        if (!termToAssign) throw new Error("Term not found")
        const currentTerms = company.terms.map((term) => ({
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
        set(companyState(companyId), (prev) => ({
          ...prev,
          terms: [...prev.terms, termToAssign],
        }))
        if (!isCompaniesListSet()) return
        set(companiesState, (prev) =>
          prev.map((prevCompany) => {
            if (prevCompany.id === companyId) {
              return {
                ...prevCompany,
                terms: [...prevCompany.terms, termToAssign],
              }
            }
            return prevCompany
          }),
        )
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
