import { atom, atomFamily, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type {
  Company,
  Credit,
  Payment,
  Term,
  TermOffering,
} from "src/schema.types"

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
    const sortOrder = get(listSortOrderState("pending-authorizations")) ?? "asc"
    return Array.from(companies.values()).toSorted((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
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
> & {
  borrower: {
    data: Pick<Credit["borrower"], "id" | "firstName" | "lastName">
  }
  payments: {
    data: Pick<Payment, "id" | "paidAt" | "amount">[] | null
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
  "id" | "loan" | "dispersedAt" | "installationStatus" | "installationDate"
> & {
  borrower: Pick<Credit["borrower"], "id" | "firstName" | "lastName">
  payments: Pick<Payment, "id" | "paidAt" | "amount">[]
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
                "id,status,installationStatus,dispersedAt,loan,installationDate,borrower,payments,termOffering",
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

      console.log({ data })

      return data
        .filter((credit) => {
          const isInstalled = credit.installationStatus === "installed"
          // check if at least one payment is missing compared to the term duration
          // ! Todo: this should also consider the amortization schedule not just the number of payments
          const isMissingPayments =
            credit.payments.data?.length !==
            credit.termOffering.data.term.data.duration
          return isInstalled && isMissingPayments
        })
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

export const installedCreditWithPaymentSelectedState = atomFamily<
  boolean,
  string
>({
  key: "installedWithPaymentCreditSelectedState",
  default: false,
})

export const selectedInstalledCreditWithPaymentsIdsState = selectorFamily<
  string[],
  string
>({
  key: "selectedInstalledCreditWithPaymentsIdsState",
  get:
    (companyId) =>
    ({ get }) => {
      const credits = get(companyCreditsDetailedWithPaymentsSelector(companyId))
      return (
        credits
          ?.filter((credit) =>
            get(installedCreditWithPaymentSelectedState(credit.id)),
          )
          .map((credit) => credit.id) ?? []
      )
    },
})
