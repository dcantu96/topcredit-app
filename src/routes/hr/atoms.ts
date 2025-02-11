import { atomFamily, selectorFamily } from "recoil"

import { apiSelector } from "components/providers/api/atoms"

import type { Credit, Term } from "src/schema.types"
import { myProfileState } from "components/providers/auth/atoms"

export type HRCreditViewMode = "pending" | "active" | "inactive" | "all"

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

      const filter: Record<string, string | number | null> = {
        status: "authorized",
      }

      if (mode === "pending") {
        filter.company = user.hrCompanyId
        filter.hrStatus = null
      } else if (mode !== "all") {
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

export const editableDispersionReceiptFieldState = atomFamily<
  string | null,
  string
>({
  key: "editableDispersionReceiptFieldState",
  default: null,
})
