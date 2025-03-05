import { atom, selector, selectorFamily } from "recoil"

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
      "id" | "status" | "firstDiscountDate" | "dispersedAt" | "loan"
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
    "id" | "status" | "firstDiscountDate" | "dispersedAt" | "loan" | "payments"
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
            credits: "id,status,dispersedAt,loan,firstDiscountDate,payments",
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
  | "firstDiscountDate"
  | "dispersedAt"
  | "loan"
  | "amortization"
  | "creditAmount"
  | "maxLoanAmount"
  | "hrStatus"
> & {
  borrower: {
    data: Pick<
      Credit["borrower"],
      "id" | "firstName" | "lastName" | "employeeNumber"
    >
  }
  payments: {
    data: Pick<
      Payment,
      | "id"
      | "paidAt"
      | "amount"
      | "number"
      | "expectedAt"
      | "expectedAmount"
      | "hrConfirmedAt"
    >[]
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
  | "firstDiscountDate"
  | "dispersedAt"
  | "loan"
  | "amortization"
  | "creditAmount"
  | "maxLoanAmount"
  | "hrStatus"
> & {
  borrower: Pick<
    Credit["borrower"],
    "id" | "firstName" | "lastName" | "employeeNumber"
  >
  payments: Pick<
    Payment,
    | "id"
    | "paidAt"
    | "amount"
    | "number"
    | "expectedAt"
    | "expectedAmount"
    | "hrConfirmedAt"
  >[]
  termOffering: Pick<TermOffering, "id"> & {
    term: Pick<Term, "id" | "durationType" | "duration">
    company: Pick<Company, "rate">
  }
}

export const companyCreditsDetailedWithPaymentsSelector = selectorFamily<
  CompanyCreditDetailed[],
  string
>({
  key: "companyCreditsDetailedWithPaymentsSelector",
  get:
    (companyId) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: CompanyCreditDetailedResponse[] } = await api.get(
        "credits",
        {
          params: {
            fields: {
              terms: "id,durationType,duration",
              companies: "rate",
              termOfferings: "id,term,company",
              users: "id,firstName,lastName,email,employeeNumber",
              credits:
                "id,status,dispersedAt,hrStatus,loan,firstDiscountDate,borrower,payments,termOffering,amortization,creditAmount,maxLoanAmount",
            },
            include:
              "borrower,payments,termOffering,termOffering.term,termOffering.company",
            filter: {
              company: companyId,
              status: "dispersed",
            },
          },
        },
      )

      return data
        .toSorted((a, b) => {
          return (
            new Date(a.firstDiscountDate!).getTime() -
            new Date(b.firstDiscountDate!).getTime()
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
            credit.payments.data?.toSorted((a, b) => a.number - b.number) || [],
        }))
    },
})
