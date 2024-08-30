import { atomFamily, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Credit, Term } from "src/schema.types"
import { myProfileState } from "components/providers/auth/atoms"

export type HRCreditViewMode = "history" | "requests"

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
      const { data }: { data: HRCreditsResponse[] } = await api.get("credit", {
        params: {
          fields: {
            credits:
              "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus",
          },
          include: "borrower,termOffering.term",
          filter: {
            company: user?.hrCompanyId,
            status: "authorized",
            hrStatus: mode === "history" ? "active" : null,
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
          | "hrStatus"
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

export const hrCreditsSortedSelector = selectorFamily<
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
  >[],
  HRCreditViewMode
>({
  key: "hrCreditsSortedSelector",
  get:
    (mode) =>
    ({ get }) => {
      const hrCredits = get(hrCreditsSelectorQuery(mode))
      const sortOrder =
        get(listSortOrderState("pending-authorizations")) ?? "asc"
      return Array.from(hrCredits.values()).toSorted((a, b) => {
        if (sortOrder === "asc") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    },
  set:
    (mode) =>
    ({ set }, newValue) => {
      set(hrCreditsState(mode), newValue)
    },
})

export const hrCreditsState = atomFamily<
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
  >[],
  HRCreditViewMode
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
      const credits = get(hrCreditsSelectorQuery("requests"))
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
