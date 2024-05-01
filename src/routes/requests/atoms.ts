import { atomFamily, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { DocumentStatus, User } from "src/schema.types"

type BasicDetailsTableResponse = Pick<
  User,
  | "createdAt"
  | "email"
  | "employeeNumber"
  | "firstName"
  | "id"
  | "lastName"
  | "rfc"
  | "salary"
  | "state"
>

export const basicDetailsListSelectorQuery = selector<
  ReadonlyMap<string, BasicDetailsTableResponse>
>({
  key: "basicDetailsListSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data }: { data: BasicDetailsTableResponse[] } = await api.get(
      "users",
      {
        params: {
          fields: {
            users:
              "employeeNumber,rfc,salary,firstName,lastName,email,createdAt,state",
          },
          filter: {
            byRole: "",
          },
        },
      },
    )

    const basicDetailsMap = new Map<string, BasicDetailsTableResponse>()
    for (const details of data) {
      basicDetailsMap.set(details.id, details)
    }
    return basicDetailsMap
  },
})

export const basicDetailsSortedSelector = selector<BasicDetailsTableResponse[]>(
  {
    key: "basicDetailsSortedSelector",
    get: ({ get }) => {
      const basicDetailsMap = get(basicDetailsListSelectorQuery)
      const sortOrder = get(listSortOrderState("requests")) ?? "asc"
      return Array.from(basicDetailsMap.values()).toSorted((a, b) => {
        if (sortOrder === "asc") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    },
    set: ({ set }, newValue) => {
      set(basicDetailsSortedSelector, newValue)
    },
  },
)

export const basicDetailsSelector = selectorFamily<User | undefined, number>({
  key: "requestSelector",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: User } = await api.get(`users/${id}`)
      return data
    },
})

export const bankStatementStatusSelector = selectorFamily<
  DocumentStatus,
  number
>({
  key: "bankStatementStatusSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(basicDetailsSelector(id))
      return user?.bankStatementStatus ?? null
    },
})

export const bankStatementRejectionReasonSelector = selectorFamily<
  string | null,
  number
>({
  key: "bankStatementRejectionReasonSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(basicDetailsSelector(id))
      return user?.bankStatementRejectionReason ?? null
    },
})

export const proofOfAddressStatusSelector = selectorFamily<
  DocumentStatus,
  number
>({
  key: "proofOfAddressStatusSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(basicDetailsSelector(id))
      return user?.proofOfAddressStatus ?? null
    },
})

export const proofOfAddressRejectionReasonSelector = selectorFamily<
  string | null,
  number
>({
  key: "proofOfAddressRejectionReasonSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(basicDetailsSelector(id))
      return user?.proofOfAddressRejectionReason ?? null
    },
})

export const identityDocumentStatusSelector = selectorFamily<
  DocumentStatus,
  number
>({
  key: "identityDocumentStatusSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(basicDetailsSelector(id))
      return user?.identityDocumentStatus ?? null
    },
})

export const identityDocumentRejectionReasonSelector = selectorFamily<
  string | null,
  number
>({
  key: "identityDocumentRejectionReasonSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(basicDetailsSelector(id))
      return user?.identityDocumentRejectionReason ?? null
    },
})

export const payrollReceiptStatusSelector = selectorFamily<
  DocumentStatus,
  number
>({
  key: "payrollReceiptStatusSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(basicDetailsSelector(id))
      return user?.payrollReceiptStatus ?? null
    },
})

export const payrollReceiptRejectionReasonSelector = selectorFamily<
  string | null,
  number
>({
  key: "payrollReceiptRejectionReasonSelector",
  get:
    (id) =>
    async ({ get }) => {
      const user = get(basicDetailsSelector(id))
      return user?.payrollReceiptRejectionReason ?? null
    },
})

export const bankStatementStatusState = atomFamily<DocumentStatus, number>({
  key: "bankStatementStatusState",
  default: bankStatementStatusSelector,
})

export const proofOfAddressStatusState = atomFamily<DocumentStatus, number>({
  key: "proofOfAddressStatusState",
  default: proofOfAddressStatusSelector,
})

export const identityDocumentStatusState = atomFamily<DocumentStatus, number>({
  key: "identityDocumentStatusState",
  default: identityDocumentStatusSelector,
})

export const payrollReceiptStatusState = atomFamily<DocumentStatus, number>({
  key: "payrollReceiptStatusState",
  default: payrollReceiptStatusSelector,
})

export const bankStatementRejectionReasonState = atomFamily<
  string | null,
  number
>({
  key: "bankStatementRejectionReasonState",
  default: bankStatementRejectionReasonSelector,
})

export const proofOfAddressRejectionReasonState = atomFamily<
  string | null,
  number
>({
  key: "proofOfAddressRejectionReasonState",
  default: proofOfAddressRejectionReasonSelector,
})

export const identityDocumentRejectionReasonState = atomFamily<
  string | null,
  number
>({
  key: "identityDocumentRejectionReasonState",
  default: identityDocumentRejectionReasonSelector,
})

export const payrollReceiptRejectionReasonState = atomFamily<
  string | null,
  number
>({
  key: "payrollReceiptRejectionReasonState",
  default: payrollReceiptRejectionReasonSelector,
})
