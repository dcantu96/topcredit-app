import { apiSelector } from "components/providers/api/atoms"
import { atom, atomFamily, selector, selectorFamily } from "recoil"
import { Company, Term } from "src/schema.types"

export interface CompanyWithTermsResponse extends Omit<Company, "terms"> {
  terms?: {
    data?: Term[]
  }
}

export const companiesSelectorQuery = selector<Company[]>({
  key: "companiesSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data }: { data: CompanyWithTermsResponse[] } = await api.get(
      "companies",
      {
        params: {
          include: "terms",
        },
      },
    )
    return data.map((company) => ({
      ...company,
      terms:
        company.terms?.data?.map((term) => ({
          ...term,
        })) ?? [],
    }))
  },
})

export const companiesState = atom({
  key: "companiesState",
  default: companiesSelectorQuery,
})

export const companySelectorQuery = selectorFamily<Company, string>({
  key: "companySelectorQuery",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: CompanyWithTermsResponse } = await api.get(
        `company/${id}`,
        {
          params: {
            include: "terms",
          },
        },
      )
      return {
        ...data,
        terms:
          data.terms?.data?.map((term) => ({
            ...term,
          })) ?? [],
      }
    },
})

export const companyState = atomFamily({
  key: "companyState",
  default: companySelectorQuery,
})

type CompanyFilters = {
  domain?: string
  name?: string
  rate?: number
  borrowingCapacity?: number | null
  employeeSalaryFrequency?: "biweekly" | "monthly"
}

type CompanyDataParams = {
  filter?: CompanyFilters
  include?: string
  fields?: string
}

export const companiesDataSelector = selectorFamily<
  Company[],
  CompanyDataParams
>({
  key: "companyDataSelector",
  get:
    (params) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: CompanyWithTermsResponse[] } = await api.get(
        `companies`,
        { params },
      )
      console.log(data)
      return data.map((company) => ({
        ...company,
        terms:
          company.terms?.data?.map((term) => ({
            ...term,
          })) ?? [],
      }))
    },
})
