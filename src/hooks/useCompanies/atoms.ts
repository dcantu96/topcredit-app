import { selector } from "recoil"

import { apiSelector } from "components/providers/api/atoms"
import { Company, Term } from "src/schema.types"

type CompanyResponse = Pick<
  Company,
  | "borrowingCapacity"
  | "id"
  | "domain"
  | "rate"
  | "name"
  | "employeeSalaryFrequency"
> & {
  terms: {
    data: Term[]
  }
}

export const companiesSelectorQuery = selector<
  Map<
    string,
    Pick<
      Company,
      | "borrowingCapacity"
      | "id"
      | "domain"
      | "rate"
      | "name"
      | "terms"
      | "employeeSalaryFrequency"
    >
  >
>({
  key: "companiesForPreAuthSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data }: { data: CompanyResponse[] } = await api.get("companies", {
      params: {
        fields: {
          companies:
            "borrowingCapacity,id,domain,terms,rate,name,employeeSalaryFrequency",
        },
        include: "terms",
      },
    })

    const map = new Map<
      string,
      Pick<
        Company,
        | "borrowingCapacity"
        | "id"
        | "domain"
        | "rate"
        | "name"
        | "terms"
        | "employeeSalaryFrequency"
      >
    >()
    for (const company of data) {
      map.set(company.domain, {
        id: company.id,
        domain: company.domain,
        name: company.name,
        borrowingCapacity: company.borrowingCapacity,
        terms: company.terms.data,
        employeeSalaryFrequency: company.employeeSalaryFrequency,
        rate: company.rate,
      })
    }
    return map
  },
})
