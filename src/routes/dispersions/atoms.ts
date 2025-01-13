import { atom, atomFamily, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Credit, Term } from "src/schema.types"

export type DispersionsResponse = Pick<
  Credit,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "loan"
  | "amortization"
  | "hrStatus"
  | "dispersedAt"
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

export const dispersionsSelectorQuery = selector<
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
  >
>({
  key: "dispersionsSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data }: { data: DispersionsResponse[] } = await api.get("credit", {
      params: {
        fields: {
          credits:
            "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus",
        },
        include: "borrower,termOffering.term",
        filter: {
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

export const dispersionsSortedSelector = selector<
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
  >[]
>({
  key: "dispersionsSortedSelector",
  get: ({ get }) => {
    const dispersions = get(dispersionsSelectorQuery)
    const sortOrder = get(listSortOrderState("pending-authorizations")) ?? "asc"
    return Array.from(dispersions.values()).toSorted((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  },
  set: ({ set }, newValue) => {
    set(dispersionsState, newValue)
  },
})

export const dispersionsState = atom<
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
  >[]
>({
  key: "dispersionsState",
  default: dispersionsSortedSelector,
})

export const dispersionsSelector = selectorFamily<
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
      | "dispersedAt"
    >
  | undefined,
  string
>({
  key: "dispersionsSelector",
  get:
    (creditId) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: DispersionsResponse } = await api.get(
        "credits/" + creditId,
        {
          params: {
            fields: {
              credits:
                "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,dispersedAt",
            },
            include: "borrower,termOffering.term",
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
