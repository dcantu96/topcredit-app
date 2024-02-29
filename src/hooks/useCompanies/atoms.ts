import { selector } from "recoil"

import { apiSelector } from "components/providers/api/atoms"
import { Company, Term } from "src/schema.types"

type CompanyAuthResponse = Pick<
  Company,
  "borrowingCapacity" | "id" | "domain" | "rate"
> & {
  terms: {
    data: Term[]
  }
}

export const companiesSelectorQuery = selector<
  Map<
    string,
    { borrowingCapacity: number | null; terms: Term[]; rate: number | null }
  >
>({
  key: "companiesForPreAuthSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get<CompanyAuthResponse[]>("companies", {
      params: {
        fields: {
          companies: "borrowingCapacity,id,domain,terms,rate",
        },
        include: "terms",
      },
    })

    const map = new Map<
      string,
      { borrowingCapacity: number | null; terms: Term[]; rate: number | null }
    >()
    for (const company of data) {
      map.set(company.domain, {
        borrowingCapacity: company.borrowingCapacity,
        terms: company.terms.data,
        rate: company.rate,
      })
    }
    return map
  },
})
