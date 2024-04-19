import { atom, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Company, Credit } from "src/schema.types"

export type CompanyCreditsResponse = Pick<
  Company,
  "id" | "name" | "domain" | "createdAt"
> & {
  credits: {
    data: Pick<Credit, "id" | "status" | "installationStatus" | "dispersedAt">[]
  }
}

export type CompanyCredits = Pick<
  Company,
  "id" | "name" | "domain" | "createdAt"
> & {
  credits: Pick<
    Credit,
    "id" | "status" | "installationStatus" | "dispersedAt"
  >[]
}

export type CompanyCreditsDetailedResponse = Pick<
  Company,
  "id" | "name" | "domain" | "createdAt"
> & {
  credits: {
    data: (Pick<
      Credit,
      "id" | "loan" | "dispersedAt" | "installationStatus"
    > & {
      borrower: {
        data: Pick<Credit["borrower"], "id" | "firstName" | "lastName">
      }
    })[]
  }
}

export type CompanyCreditsDetailed = Pick<
  Company,
  "id" | "name" | "domain" | "createdAt"
> & {
  credits: (Pick<
    Credit,
    "id" | "loan" | "dispersedAt" | "installationStatus"
  > & {
    borrower: Pick<Credit["borrower"], "id" | "firstName" | "lastName">
  })[]
}

export const companyCreditsSelectorQuery = selector<
  Map<string, CompanyCredits>
>({
  key: "companyCreditsSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data }: { data: CompanyCreditsResponse[] } = await api.get(
      "companies",
      {
        params: {
          fields: {
            companies: "id,name,domain,createdAt,credits",
            credits: "id,status,installationStatus,dispersedAt",
          },
          include: "credits",
        },
      },
    )

    const map = new Map<string, CompanyCredits>()
    for (const company of data) {
      map.set(company.id, {
        ...company,
        credits: company.credits.data,
      })
    }
    return map
  },
})

export const companyCreditsSortedSelector = selector<CompanyCredits[]>({
  key: "companyCreditsSortedSelector",
  get: ({ get }) => {
    const companies = get(companyCreditsSelectorQuery)
    const sortOrder = get(listSortOrderState("pending-authorizations")) ?? "asc"
    return Array.from(companies.values()).toSorted((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  },
  set: ({ set }, newValue) => {
    set(companyCreditsState, newValue)
  },
})

export const companyCreditsState = atom<CompanyCredits[]>({
  key: "companyCreditsState",
  default: companyCreditsSortedSelector,
})

export const companyCreditsDetailedSelector = selectorFamily<
  CompanyCreditsDetailed | undefined,
  string | undefined
>({
  key: "companyCreditsDetailedSelector",
  get:
    (id) =>
    async ({ get }) => {
      if (!id) {
        return undefined
      }
      const api = get(apiSelector)
      const { data }: { data: CompanyCreditsDetailedResponse } = await api.get(
        "companies/" + id,
        {
          params: {
            fields: {
              companies: "id,name,domain,createdAt,credits",
              credits: "id,borrower,loan,dispersedAt,installationStatus,status",
              user: "id,firstName,lastName,email",
            },
            include: "credits,credits.borrower",
          },
        },
      )

      console.log(data)

      return {
        ...data,
        credits: data.credits.data.map((credit) => ({
          ...credit,
          borrower: credit.borrower.data,
        })),
      }
    },
})
