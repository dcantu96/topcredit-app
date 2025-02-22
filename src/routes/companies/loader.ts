import { apiSelector } from "components/providers/api/atoms"
import { atom, atomFamily, selector, selectorFamily } from "recoil"
import { Company, Credit, Payment, Term, TermOffering } from "src/schema.types"

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
  employeeSalaryFrequency?: "bi-monthly" | "monthly"
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

export interface CompanyPaymentFilters {
  range?: "last-7-days" | "last-payment" | "last-2-payments" | "last-4-payments"
}

export interface CompanyCreditsFilters {
  range?: "last-7-days" | "last-payment" | "last-2-payments" | "last-4-payments"
}

export const companyPaymentFiltersState = atom<CompanyPaymentFilters>({
  key: "companyPaymentFiltersState",
  default: { range: "last-7-days" },
})

export const companyPaymentsQuery = selectorFamily<
  Pick<
    Payment,
    "id" | "amount" | "number" | "paidAt" | "updatedAt" | "createdAt"
  >[],
  string
>({
  key: "companyPaymentsQuery",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const filters = get(companyPaymentFiltersState)
      const {
        data,
      }: {
        data: Pick<
          Payment,
          "id" | "amount" | "number" | "paidAt" | "updatedAt" | "createdAt"
        >[]
      } = await api.get(`company/${id}/payments`, {
        params: {
          filter: {
            range: filters.range,
          },
        },
      })
      return data
    },
})

export const companyDispersedCreditsQuery = selectorFamily<
  Pick<
    Credit,
    "id" | "creditAmount" | "dispersedAt" | "updatedAt" | "createdAt"
  >[],
  string
>({
  key: "companyDispersedCreditsQuery",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const filters = get(companyPaymentFiltersState)
      const {
        data,
      }: {
        data: Pick<
          Credit,
          "id" | "creditAmount" | "dispersedAt" | "updatedAt" | "createdAt"
        >[]
      } = await api.get(`company/${id}/credits`, {
        params: {
          fields: {
            credits: "id,creditAmount,dispersedAt,updatedAt,createdAt",
          },
          filter: {
            dispersedAtRange: filters.range,
          },
        },
      })
      return data
    },
})

export const companyNewlyInstalledCreditsQuery = selectorFamily<
  Pick<Credit, "id" | "creditAmount" | "updatedAt" | "createdAt">[],
  string
>({
  key: "companyNewlyInstalledCreditsQuery",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const filters = get(companyPaymentFiltersState)
      const {
        data,
      }: {
        data: Pick<Credit, "id" | "creditAmount" | "updatedAt" | "createdAt">[]
      } = await api.get(`company/${id}/credits`, {
        params: {
          fields: {
            credits: "id,creditAmount,updatedAt,createdAt",
          },
          filter: {
            firstDiscountDateRange: filters.range,
          },
        },
      })
      return data
    },
})

export const companyInstalledCreditsQuery = selectorFamily<
  Pick<Credit, "id" | "updatedAt" | "createdAt" | "amortization">[],
  string
>({
  key: "companyInstalledCreditsQuery",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const {
        data,
      }: {
        data: Pick<Credit, "id" | "updatedAt" | "createdAt" | "amortization">[]
      } = await api.get(`company/${id}/credits`, {
        params: {
          fields: {
            credits: "id,updatedAt,createdAt,amortization,firstDiscountDate",
          },
          filter: {
            status: "dispersed",
          },
        },
      })
      return data
    },
})
