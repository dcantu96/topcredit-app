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
import { companiesState, companyState } from "./loader"

export const useCompanyActions = () => {
  const { isCompaniesListActive } = useCompaniesActions()
  const createCompany = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({
        domain,
        name,
        rate,
        borrowingCapacity,
        employeeSalaryFrequency,
      }: NewCompany) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        const { data } = await api.create("company", {
          domain,
          name,
          rate,
          borrowingCapacity,
          employeeSalaryFrequency,
        })
        if (!isCompaniesListActive()) return
        set(companiesState, (prev) => [
          ...prev,
          {
            id: data.id,
            domain,
            name,
            terms: [],
            rate: rate ?? null,
            borrowingCapacity: borrowingCapacity ?? null,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            employeeSalaryFrequency: employeeSalaryFrequency,
          },
        ])
      },
  )
  const updateCompany = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({
        id,
        domain,
        name,
        rate,
        borrowingCapacity,
        employeeSalaryFrequency,
      }: EditCompany) => {
        const api = snapshot.getLoadable(apiSelector).getValue()
        await api.update("company", {
          id,
          domain,
          name,
          rate,
          borrowingCapacity,
          employeeSalaryFrequency,
        })
        set(companyState(id), (prev) => ({
          ...prev,
          domain: domain ?? prev.domain,
          rate: rate ?? prev.rate,
          borrowingCapacity: borrowingCapacity ?? prev.borrowingCapacity,
          employeeSalaryFrequency:
            employeeSalaryFrequency ?? prev.employeeSalaryFrequency,
        }))

        if (!isCompaniesListActive()) return
        set(companiesState, (prev) =>
          prev.map((prevCompany) => {
            if (prevCompany.id === id) {
              return {
                ...prevCompany,
                domain: domain ?? prevCompany.domain,
                rate: rate ?? prevCompany.rate,
                borrowingCapacity:
                  borrowingCapacity ?? prevCompany.borrowingCapacity,
                employeeSalaryFrequency:
                  employeeSalaryFrequency ??
                  prevCompany.employeeSalaryFrequency,
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
  const isCompaniesListActive = useRecoilCallback(({ snapshot }) => () => {
    return snapshot.getInfo_UNSTABLE(companiesState).isActive
  })
  return {
    isCompaniesListActive,
  }
}

export const useTermActions = () => {
  const { isCompaniesListActive } = useCompaniesActions()
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
        if (!isCompaniesListActive()) return
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
