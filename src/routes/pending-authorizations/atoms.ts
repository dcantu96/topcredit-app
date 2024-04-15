import { atom, atomFamily, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Credit, DocumentStatus, Term } from "src/schema.types"

export type PendingAuthorizationsResponse = Omit<
  Credit,
  "borrower" | "termOffering"
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
              credits:
                "id,status,borrower,updatedAt,createdAt,loan,termOffering",
            },
            include: "borrower,termOffering.term",
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
          termOffering: {
            ...credit.termOffering.data,
            term: credit.termOffering.data.term.data,
          },
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
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: PendingAuthorizationsResponse } = await api.get(
        "credits/" + creditId,
        {
          params: {
            include: "borrower,termOffering.term",
          },
        },
      )

      return {
        ...data,
        borrower: data.borrower.data,
        termOffering: {
          ...data.termOffering.data,
          term: data.termOffering.data.term.data,
        },
      }
    },
})

export const payrollReceiptStatusCreditSelector = selectorFamily<
  DocumentStatus,
  string
>({
  key: "payrollReceiptStatusCreditSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(creditSelector(id))
      return user?.payrollReceiptStatus ?? null
    },
})

export const payrollReceiptStatusCreditState = atomFamily<
  DocumentStatus,
  string
>({
  key: "payrollReceiptStatusCreditState",
  default: payrollReceiptStatusCreditSelector,
})

export const payrollReceiptRejectionReasonCreditSelector = selectorFamily<
  string | null,
  string
>({
  key: "payrollReceiptRejectionReasonCreditSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(creditSelector(id))
      return user?.payrollReceiptRejectionReason ?? null
    },
})

export const payrollReceiptRejectionReasonCreditState = atomFamily<
  string | null,
  string
>({
  key: "payrollReceiptRejectionReasonCreditState",
  default: payrollReceiptRejectionReasonCreditSelector,
})

export const authorizationStatusCreditSelector = selectorFamily<
  DocumentStatus,
  string
>({
  key: "authorizationStatusCreditSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(creditSelector(id))
      return user?.authorizationStatus ?? null
    },
})

export const authorizationStatusCreditState = atomFamily<
  DocumentStatus,
  string
>({
  key: "authorizationStatusCreditState",
  default: authorizationStatusCreditSelector,
})

export const authorizationRejectionReasonCreditSelector = selectorFamily<
  string | null,
  string
>({
  key: "authorizationRejectionReasonCreditSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(creditSelector(id))
      return user?.authorizationRejectionReason ?? null
    },
})

export const authorizationRejectionReasonCreditState = atomFamily<
  string | null,
  string
>({
  key: "authorizationRejectionReasonCreditState",
  default: authorizationRejectionReasonCreditSelector,
})

export const contractStatusCreditSelector = selectorFamily<
  DocumentStatus,
  string
>({
  key: "contractStatusCreditSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(creditSelector(id))
      return user?.contractStatus ?? null
    },
})

export const contractStatusCreditState = atomFamily<DocumentStatus, string>({
  key: "contractStatusCreditState",
  default: contractStatusCreditSelector,
})

export const contractRejectionReasonCreditSelector = selectorFamily<
  string | null,
  string
>({
  key: "contractRejectionReasonCreditSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(creditSelector(id))
      return user?.contractRejectionReason ?? null
    },
})

export const contractRejectionReasonCreditState = atomFamily<
  string | null,
  string
>({
  key: "contractRejectionReasonCreditState",
  default: contractRejectionReasonCreditSelector,
})
