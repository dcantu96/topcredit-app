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
  | "firstDiscountDate"
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

type DispersionCredit = Pick<
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
  | "firstDiscountDate"
>

export const dispersionsSelectorQuery = selector<Map<string, DispersionCredit>>(
  {
    key: "dispersionsSelectorQuery",
    get: async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: DispersionsResponse[] } = await api.get(
        "credit",
        {
          params: {
            fields: {
              credits:
                "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,firstDiscountDate",
            },
            include: "borrower,termOffering.term",
            filter: {
              status: "authorized",
              hrStatus: "approved",
            },
          },
        },
      )

      const map = new Map<string, DispersionCredit>()
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
  },
)

export const dispersionsSortedSelector = selector<DispersionCredit[]>({
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

export const dispersionsState = atom<DispersionCredit[]>({
  key: "dispersionsState",
  default: dispersionsSortedSelector,
})

export const dispersionsSelector = selectorFamily<
  DispersionCredit | undefined,
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
                "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,dispersedAt,firstDiscountDate",
            },
            include: "borrower,termOffering.term",
          },
        },
      )

      if (data.status === "dispersed") {
        throw new Error("Crédito ya fue dispersado")
      }
      if (data.status !== "authorized") {
        throw new Error("Crédito no está autorizado")
      }
      if (data.hrStatus !== "approved") {
        throw new Error("Crédito no está aprobado por RH")
      }

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
