import { atomFamily, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Credit, Term, TermOffering } from "src/schema.types"

type InstalledCreditResponse = Pick<
  Credit,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "loan"
  | "dispersedAt"
  | "installationStatus"
> & {
  borrower: {
    data: Credit["borrower"]
  }
  termOffering: {
    data: {
      id: TermOffering["id"]
      createdAt: TermOffering["createdAt"]
      updatedAt: TermOffering["updatedAt"]
      term: {
        data: Term
      }
    }
  }
}

export type InstalledCredit = Pick<
  Credit,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "loan"
  | "borrower"
  | "dispersedAt"
  | "installationStatus"
> & {
  termOffering: {
    id: TermOffering["id"]
    createdAt: TermOffering["createdAt"]
    updatedAt: TermOffering["updatedAt"]
    term: Term
  }
}

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
            credits:
              "id,status,updatedAt,createdAt,loan,borrower,termOffering,dispersedAt,installationStatus",
          },
          include: "borrower,termOffering,termOffering.term",
          filter: {
            status: "dispersed",
          },
        },
      },
    )

    console.log("data", { data })

    const map = new Map<string, InstalledCredit>()
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
})

type InstallationStatus = "installed" | null

export const installationsSortedSelector = selectorFamily<
  InstalledCredit[],
  InstallationStatus
>({
  key: "installationsSortedSelector",
  get:
    (status) =>
    ({ get }) => {
      const installations = get(installationsSelectorQuery)
      const sortOrder =
        get(listSortOrderState("pending-authorizations")) ?? "asc"
      return Array.from(installations.values())
        .filter((i) => i.installationStatus === status)
        .toSorted((a, b) => {
          if (sortOrder === "asc") {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          }
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        })
    },
  set:
    (status) =>
    ({ set }, newValue) => {
      set(installationsState(status), newValue)
    },
})

export const installationsState = atomFamily<
  InstalledCredit[],
  InstallationStatus
>({
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

export const installedCreditSelectedState = atomFamily<boolean, string>({
  key: "installedCreditSelectedState",
  default: false,
})

export const selectedInstalledCreditIdsState = selectorFamily<
  string[],
  InstallationStatus
>({
  key: "selectedInstalledCreditIdsState",
  get:
    (status) =>
    ({ get }) => {
      const credits = get(installationsState(status))
      return credits
        .filter((credit) => get(installedCreditSelectedState(credit.id)))
        .map((credit) => credit.id)
    },
})
