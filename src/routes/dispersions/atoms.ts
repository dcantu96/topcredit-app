import { atom, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Credit } from "src/schema.types"

export type DispersionsResponse = Pick<
  Credit,
  "id" | "status" | "updatedAt" | "createdAt" | "loan"
> & {
  borrower: {
    data: Credit["borrower"]
  }
  term: {
    data: Credit["term"]
  }
}

export const dispersionsSelectorQuery = selector<
  Map<
    string,
    Pick<
      Credit,
      "id" | "status" | "updatedAt" | "createdAt" | "loan" | "term" | "borrower"
    >
  >
>({
  key: "dispersionsSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data }: { data: DispersionsResponse[] } = await api.get("credit", {
      params: {
        fields: {
          credits: "id,status,updatedAt,createdAt,loan,borrower,term",
        },
        include: "borrower,term",
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
        | "term"
        | "borrower"
      >
    >()
    for (const credit of data) {
      map.set(credit.id, {
        ...credit,
        borrower: credit.borrower.data,
        term: credit.term.data,
      })
    }
    return map
  },
})

export const dispersionsSortedSelector = selector<
  Pick<
    Credit,
    "id" | "status" | "updatedAt" | "createdAt" | "loan" | "term" | "borrower"
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
    "id" | "status" | "updatedAt" | "createdAt" | "loan" | "term" | "borrower"
  >[]
>({
  key: "dispersionsState",
  default: dispersionsSortedSelector,
})

export const dispersionsSelector = selectorFamily<
  | Pick<
      Credit,
      "id" | "status" | "updatedAt" | "createdAt" | "loan" | "term" | "borrower"
    >
  | undefined,
  string
>({
  key: "dispersionsSelector",
  get:
    (creditId) =>
    ({ get }) => {
      const credits = get(dispersionsSelectorQuery)
      return credits.get(creditId)
    },
})
