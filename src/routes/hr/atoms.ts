import { atomFamily, selectorFamily } from "recoil"

import { apiSelector } from "components/providers/api/atoms"

import type { Credit, Term } from "src/schema.types"
import { myProfileState } from "components/providers/auth/atoms"

export type HRCreditViewMode = "pending" | "approved" | "denied" | "all"

export type HRCreditsResponse = Pick<
  Credit,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "loan"
  | "amortization"
  | "hrStatus"
> & {
  borrower: {
    data: Credit["borrower"]
  }
  termOffering: {
    data: Credit["termOffering"] & {
      term: {
        data: Term
      }
    }
  }
  payments: {
    data: Credit["payments"]
  }
}

export const hrCreditsSelectorQuery = selectorFamily<
  Map<
    string,
    Pick<
      Credit,
      | "id"
      | "status"
      | "updatedAt"
      | "createdAt"
      | "loan"
      | "termOffering"
      | "borrower"
      | "amortization"
      | "hrStatus"
      | "payments"
    >
  >,
  HRCreditViewMode
>({
  key: "hrCreditsSelectorQuery",
  get:
    (mode) =>
    async ({ get }) => {
      const user = get(myProfileState)
      const api = get(apiSelector)

      if (!user?.roles.includes("admin") && !user?.roles.length) {
        throw new Error("Usuario no autorizado")
      }

      const filter: Record<string, string | number | null> = {}

      if (mode === "pending") {
        filter.status = "authorized"
        filter.company = user.hrCompanyId
        filter.hrStatus = null
      } else if (mode !== "all") {
        filter.status = "dispersed"
        filter.company = user.hrCompanyId
        filter.hrStatus = mode
      }

      const { data }: { data: HRCreditsResponse[] } = await api.get("credit", {
        params: {
          fields: {
            credits:
              "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,payments",
          },
          include: "borrower,termOffering.term,payments",
          filter,
        },
      })

      const map = new Map<
        string,
        Pick<
          Credit,
          | "id"
          | "status"
          | "updatedAt"
          | "createdAt"
          | "loan"
          | "termOffering"
          | "borrower"
          | "amortization"
          | "hrStatus"
          | "payments"
        >
      >()
      for (const credit of data) {
        map.set(credit.id, {
          ...credit,
          borrower: credit.borrower.data,
          termOffering: {
            ...(credit.termOffering.data || {}),
            term: credit.termOffering.data?.term.data,
          },
          payments: credit.payments.data || [],
        })
      }
      return map
    },
})

export type ActiveCredit = Pick<
  Credit,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "termOffering"
  | "borrower"
  | "hrStatus"
> & {
  payments: NonNullable<Credit["payments"]>
  amortization: NonNullable<Credit["amortization"]>
  loan: NonNullable<Credit["loan"]>
}

export type ActiveCreditsMap = Map<string, ActiveCredit>

export const activeCreditsSelectorQuery = selectorFamily<
  ActiveCreditsMap,
  string
>({
  key: "activeCreditsSelectorQuery",
  get:
    (companyId) =>
    async ({ get }) => {
      const api = get(apiSelector)

      const { data }: { data: HRCreditsResponse[] } = await api.get("credit", {
        params: {
          fields: {
            credits:
              "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,payments",
          },
          include: "borrower,termOffering.term,payments",
          filter: {
            status: "dispersed",
            company: companyId,
          },
        },
      })

      const map = new Map<string, ActiveCredit>()
      for (const credit of data) {
        const payments = credit.payments.data
        const amortization = credit.amortization
        const loan = credit.loan
        if (!payments) {
          throw new Error("Payments should not be null")
        }
        if (!amortization) {
          throw new Error("Amortization should not be null")
        }
        if (!loan) {
          throw new Error("Loan should not be null")
        }
        map.set(credit.id, {
          ...credit,
          loan,
          amortization,
          borrower: credit.borrower.data,
          termOffering: {
            ...(credit.termOffering.data || {}),
            term: credit.termOffering.data?.term.data,
          },
          payments: payments.toSorted((a, b) => a.number - b.number),
        })
      }
      return map
    },
})

export const hrCreditsSelector = selectorFamily<
  | Pick<
      Credit,
      | "id"
      | "status"
      | "updatedAt"
      | "createdAt"
      | "loan"
      | "termOffering"
      | "borrower"
      | "amortization"
      | "hrStatus"
    >
  | undefined,
  string
>({
  key: "hrCreditsSelector",
  get:
    (creditId) =>
    ({ get }) => {
      const credits = get(hrCreditsSelectorQuery("all"))
      return credits.get(creditId)
    },
})

export const hrCreditSelectorQuery = selectorFamily<
  | Pick<
      Credit,
      | "id"
      | "status"
      | "updatedAt"
      | "createdAt"
      | "loan"
      | "termOffering"
      | "borrower"
      | "amortization"
      | "hrStatus"
    >
  | undefined,
  string
>({
  key: "hrCreditSelectorQuery",
  get:
    (creditId) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: HRCreditsResponse } = await api.get(
        `credits/${creditId}`,
        {
          params: {
            fields: {
              credits:
                "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,payments",
            },
            include: "borrower,termOffering.term,payments",
          },
        },
      )

      return {
        ...data,
        borrower: data.borrower.data,
        termOffering: {
          ...(data.termOffering.data || {}),
          term: data.termOffering.data?.term.data,
        },
        payments: data.payments.data || [],
      }
    },
})

export const editableDispersionReceiptFieldState = atomFamily<
  string | null,
  string
>({
  key: "editableDispersionReceiptFieldState",
  default: null,
})
