import { atom, atomFamily, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Credit, Term } from "src/schema.types"
import { myProfileState } from "components/providers/auth/atoms"

export type HRCreditsResponse = Pick<
  Credit,
  "id" | "status" | "updatedAt" | "createdAt" | "loan" | "amortization"
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
}

export const hrCreditsSelectorQuery = selector<
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
    >
  >
>({
  key: "hrCreditsSelectorQuery",
  get: async ({ get }) => {
    const user = get(myProfileState)
    const api = get(apiSelector)
    const { data }: { data: HRCreditsResponse[] } = await api.get("credit", {
      params: {
        fields: {
          credits:
            "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization",
        },
        include: "borrower,termOffering.term",
        filter: {
          company: user?.hrCompanyId,
          status: "authorized",
        },
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
      })
    }
    return map
  },
})

export const hrCreditsSortedSelector = selector<
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
  >[]
>({
  key: "hrCreditsSortedSelector",
  get: ({ get }) => {
    const hrCredits = get(hrCreditsSelectorQuery)
    const sortOrder = get(listSortOrderState("pending-authorizations")) ?? "asc"
    return Array.from(hrCredits.values()).toSorted((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  },
  set: ({ set }, newValue) => {
    set(hrCreditsState, newValue)
  },
})

export const hrCreditsState = atom<
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
  >[]
>({
  key: "hrCreditsState",
  default: hrCreditsSortedSelector,
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
    >
  | undefined,
  string
>({
  key: "dispersionsSelector",
  get:
    (creditId) =>
    ({ get }) => {
      const credits = get(hrCreditsSelectorQuery)
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
