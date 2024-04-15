import { apiSelector } from "components/providers/api/atoms"
import { atom, atomFamily, selector, selectorFamily } from "recoil"
import { Company, Term, TermOffering } from "src/schema.types"

type CompanyWithTermOfferings = Pick<
  Company,
  | "id"
  | "name"
  | "updatedAt"
  | "createdAt"
  | "borrowingCapacity"
  | "domain"
  | "rate"
  | "employeeSalaryFrequency"
> & {
  termOfferings: Pick<TermOffering, "term" | "id" | "createdAt" | "updatedAt">[]
}

type CompanyWithTerms = Pick<
  Company,
  | "id"
  | "name"
  | "updatedAt"
  | "createdAt"
  | "borrowingCapacity"
  | "terms"
  | "domain"
  | "rate"
  | "employeeSalaryFrequency"
>
export interface CompanyWithTermOfferingsResponse
  extends Omit<CompanyWithTermOfferings, "termOfferings"> {
  termOfferings?: {
    data?: (TermOffering & {
      term: {
        data: Term
      }
    })[]
  }
}

export interface CompanyWithTermsResponse
  extends Omit<CompanyWithTerms, "terms"> {
  terms?: {
    data: Term[]
  }
}

export const companiesSelectorQuery = selector<CompanyWithTerms[]>({
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
      terms: company.terms?.data ?? [],
    }))
  },
})

export const companiesState = atom({
  key: "companiesState",
  default: companiesSelectorQuery,
})

export const companySelectorQuery = selectorFamily<
  CompanyWithTermOfferings,
  string
>({
  key: "companySelectorQuery",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: CompanyWithTermOfferingsResponse } =
        await api.get(`company/${id}`, {
          params: {
            include: "termOfferings.term",
          },
        })
      return {
        ...data,
        termOfferings:
          data.termOfferings?.data?.map((termOffering) => ({
            ...termOffering,
            term: termOffering.term.data,
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
  CompanyWithTermOfferings[],
  CompanyDataParams
>({
  key: "companyDataSelector",
  get:
    (params) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: CompanyWithTermOfferingsResponse[] } =
        await api.get("companies", { params })
      return data.map((company) => ({
        ...company,
        termOfferings:
          company.termOfferings?.data?.map((termOffering) => ({
            ...termOffering,
            term: termOffering.term.data,
          })) ?? [],
      }))
    },
})
