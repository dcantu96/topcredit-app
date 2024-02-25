import { apiSelector } from "components/providers/api/atoms"
import { atom, selector, selectorFamily } from "recoil"
import { Company, Term } from "src/schema.types"

export interface CompanyWithTermsResponse extends Omit<Company, "terms"> {
  terms: {
    data: Term[]
  }
}

export const companiesSelectorQuery = selector<Company[]>({
  key: "companiesSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get<CompanyWithTermsResponse[]>("companies", {
      params: {
        include: "terms",
      },
    })
    return data.map((company) => ({
      ...company,
      terms: company.terms.data.map((term) => ({
        ...term,
      })),
    }))
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
      const { data } = await api.get<Company>(`company/${id}`, {
        params: {
          include: "terms",
        },
      })
      return data
    },
})
