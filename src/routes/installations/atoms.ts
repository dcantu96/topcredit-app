import { atom, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Credit } from "src/schema.types"

type InstalledCreditResponse = Pick<
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

export type InstalledCredit = Pick<
  Credit,
  "id" | "status" | "updatedAt" | "createdAt" | "loan" | "term" | "borrower"
>

export const installationsSelectorQuery = selector<
  Map<string, InstalledCredit>
>({
  key: "installationsSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data }: { data: InstalledCreditResponse[] } = await api.get(
      "credit",
      {
        params: {
          fields: {
            credits: "id,status,updatedAt,createdAt,loan,borrower,term",
          },
          include: "borrower,term",
          filter: {
            status: "dispersed",
          },
        },
      },
    )

    const map = new Map<string, InstalledCredit>()
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

export const installationsSortedSelector = selector<InstalledCredit[]>({
  key: "installationsSortedSelector",
  get: ({ get }) => {
    const installations = get(installationsSelectorQuery)
    const sortOrder = get(listSortOrderState("pending-authorizations")) ?? "asc"
    return Array.from(installations.values()).toSorted((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  },
  set: ({ set }, newValue) => {
    set(installationsState, newValue)
  },
})

export const installationsState = atom<InstalledCredit[]>({
  key: "installationsState",
  default: installationsSortedSelector,
})

export const installationsSelector = selectorFamily<
  InstalledCredit | undefined,
  string
>({
  key: "installationsSelector",
  get:
    (creditId) =>
    ({ get }) => {
      const credits = get(installationsSelectorQuery)
      return credits.get(creditId)
    },
})
