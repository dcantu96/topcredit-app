import { atom, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Credit } from "src/schema.types"

export type PendingAuthorizationsResponse = Omit<
  Credit,
  "borrower" | "term"
> & {
  borrower: {
    data: Credit["borrower"]
  }
  term: {
    data: Credit["term"]
  }
}

export const pendingAuthorizationsSelectorQuery = selector<Map<string, Credit>>(
  {
    key: "pendingAuthorizationsSelectorQuery",
    get: async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: PendingAuthorizationsResponse[] } = await api.get(
        "credit",
        {
          params: {
            fields: {
              credits: "id,status,borrower,updatedAt,createdAt,loan,term",
            },
            include: "borrower,term",
            filter: {
              status: "pending",
            },
          },
        },
      )

      const map = new Map<string, Credit>()
      for (const credit of data) {
        map.set(credit.id, {
          ...credit,
          borrower: credit.borrower.data,
          term: credit.term.data,
        })
      }
      return map
    },
  },
)

export const pendingAuthorizationsSortedSelector = selector<Credit[]>({
  key: "pendingAuthorizationsSortedSelector",
  get: ({ get }) => {
    const pendingAuthorizations = get(pendingAuthorizationsSelectorQuery)
    const sortOrder = get(listSortOrderState("pending-authorizations")) ?? "asc"
    return Array.from(pendingAuthorizations.values()).toSorted((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  },
  set: ({ set }, newValue) => {
    set(pendingAuthorizationsState, newValue)
  },
})

export const pendingAuthorizationsState = atom<Credit[]>({
  key: "pendingAuthorizationsState",
  default: pendingAuthorizationsSortedSelector,
})

export const creditSelector = selectorFamily<Credit | undefined, string>({
  key: "creditSelector",
  get:
    (creditId) =>
    ({ get }) => {
      const credits = get(pendingAuthorizationsSelectorQuery)
      return credits.get(creditId)
    },
})
