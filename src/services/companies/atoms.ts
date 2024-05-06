import { atom, atomFamily, selector, selectorFamily } from "recoil"

import { apiSelector } from "components/providers/api/atoms"

import type {
  Company,
  Credit,
  Payment,
  Term,
  TermOffering,
} from "../../schema.types"

export type CompanyCreditsResponse = Pick<
  Company,
  "id" | "name" | "domain" | "createdAt" | "employeeSalaryFrequency" | "rate"
> & {
  credits: {
    data: (Pick<
      Credit,
      | "id"
      | "status"
      | "installationStatus"
      | "dispersedAt"
      | "loan"
      | "installationDate"
    > & {
      payments: {
        data: Payment[]
      }
    })[]
  }
}

export type CompanyCredits = Pick<
  Company,
  "id" | "name" | "domain" | "createdAt" | "employeeSalaryFrequency" | "rate"
> & {
  credits: Pick<
    Credit,
    | "id"
    | "status"
    | "installationStatus"
    | "dispersedAt"
    | "loan"
    | "installationDate"
    | "payments"
  >[]
}

export const companyCreditsWithPaymentsSelectorQuery = selector<
  Map<string, CompanyCredits>
>({
  key: "companyCreditsWithPaymentsSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data }: { data: CompanyCreditsResponse[] } = await api.get(
      "companies",
      {
        params: {
          include: "credits,credits.payments",
          fields: {
            companies:
              "id,name,domain,createdAt,credits,employeeSalaryFrequency,rate",
            credits:
              "id,status,installationStatus,dispersedAt,loan,installationDate,payments",
          },
        },
      },
    )

    const map = new Map<string, CompanyCredits>()
    for (const company of data) {
      map.set(company.id, {
        ...company,
        credits: company.credits.data.map((credit) => ({
          ...credit,
          payments: credit.payments.data,
        })),
      })
    }
    return map
  },
})

export const companyCreditsWithPaymentsSortedSelector = selector<
  CompanyCredits[]
>({
  key: "companyCreditsWithPaymentsSortedSelector",
  get: ({ get }) => {
    const companies = get(companyCreditsWithPaymentsSelectorQuery)
    return Array.from(companies.values()).toSorted((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  },
})

export const companyCreditsWithPaymentsState = atom<CompanyCredits[]>({
  key: "companyCreditsWithPaymentsState",
  default: companyCreditsWithPaymentsSortedSelector,
})

export type CompanyCreditDetailedResponse = Pick<
  Credit,
  | "id"
  | "status"
  | "installationStatus"
  | "dispersedAt"
  | "loan"
  | "installationDate"
  | "amortization"
  | "creditAmount"
  | "maxLoanAmount"
> & {
  borrower: {
    data: Pick<Credit["borrower"], "id" | "firstName" | "lastName">
  }
  payments: {
    data: Pick<Payment, "id" | "paidAt" | "amount" | "number">[] | null
  }
  termOffering: {
    data: Pick<TermOffering, "id"> & {
      term: {
        data: Pick<Term, "id" | "durationType" | "duration">
      }
      company: {
        data: Pick<Company, "rate">
      }
    }
  }
}

export type CompanyCreditDetailed = Pick<
  Credit,
  | "id"
  | "status"
  | "installationStatus"
  | "dispersedAt"
  | "loan"
  | "installationDate"
  | "amortization"
  | "creditAmount"
  | "maxLoanAmount"
> & {
  borrower: Pick<Credit["borrower"], "id" | "firstName" | "lastName">
  payments: Pick<Payment, "id" | "paidAt" | "amount" | "number">[]
  termOffering: Pick<TermOffering, "id"> & {
    term: Pick<Term, "id" | "durationType" | "duration">
    company: Pick<Company, "rate">
  }
}

export const companyCreditsDetailedWithPaymentsSelector = selectorFamily<
  CompanyCreditDetailed[] | undefined,
  string | undefined
>({
  key: "companyCreditsDetailedWithPaymentsSelector",
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return undefined

      const api = get(apiSelector)
      const { data }: { data: CompanyCreditDetailedResponse[] } = await api.get(
        "credits",
        {
          params: {
            fields: {
              terms: "id,durationType,duration",
              companies: "rate",
              termOfferings: "id,term,company",
              users: "id,firstName,lastName,email",
              credits:
                "id,status,installationStatus,dispersedAt,loan,installationDate,borrower,payments,termOffering,amortization,creditAmount,maxLoanAmount",
            },
            include:
              "borrower,payments,termOffering,termOffering.term,termOffering.company",
            filter: {
              company: id,
              status: "dispersed",
            },
          },
        },
      )

      return data
        .sort((a, b) => {
          return (
            new Date(a.installationDate!).getTime() -
            new Date(b.installationDate!).getTime()
          )
        })
        .map((credit) => ({
          ...credit,
          borrower: credit.borrower.data,
          termOffering: {
            ...credit.termOffering.data,
            term: credit.termOffering.data.term.data,
            company: credit.termOffering.data.company.data,
          },
          payments:
            credit.payments.data?.sort((a, b) => {
              return new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime()
            }) ?? [],
        }))
    },
})

export const companyCreditsDetailedWithPaymentsState = atomFamily({
  key: "companyCreditsDetailedWithPaymentsState",
  default: companyCreditsDetailedWithPaymentsSelector,
})
