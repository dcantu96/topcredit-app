import { apiSelector } from "components/providers/api/atoms"
import { atom, selector, selectorFamily } from "recoil"

interface Company {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  domain?: string
  rate?: number
  terms?: string
}

interface CompanyResponse {
  id: string
  name: string
  domain: string
  rate?: number
  terms?: string
  "created-at": string
  "updated-at": string
}

export const companiesSelectorQuery = selector({
  key: "companiesSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get("companies")
    const companies = data as CompanyResponse[]
    return companies.map((company) => ({
      id: Number(company.id),
      name: company.name,
      domain: company.domain,
      rate: company.rate,
      terms: company.terms,
      createdAt: company["created-at"],
      updatedAt: company["updated-at"],
    })) as Company[]
  },
})

export const companies = atom({
  key: "companiesState",
  default: companiesSelectorQuery,
})

export const companySelectorQuery = selectorFamily({
  key: "companySelectorQuery",
  get:
    (id: string) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data } = await api.get(`company/${id}`)
      const company = data as CompanyResponse
      return {
        id: Number(company.id),
        name: company.name,
        domain: company.domain,
        rate: company.rate,
        terms: company.terms,
        createdAt: company["created-at"],
        updatedAt: company["updated-at"],
      } as Company
    },
})
