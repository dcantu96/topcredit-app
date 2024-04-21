import { atom, atomFamily, selector, selectorFamily } from "recoil"

import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"

import type { Company, Credit } from "src/schema.types"

export type CompanyCreditsResponse = Pick<
  Company,
  "id" | "name" | "domain" | "createdAt" | "employeeSalaryFrequency"
> & {
  credits: {
    data: Pick<
      Credit,
      | "id"
      | "status"
      | "installationStatus"
      | "dispersedAt"
      | "loan"
      | "installationDate"
    >[]
  }
}

export type CompanyCredits = Pick<
  Company,
  "id" | "name" | "domain" | "createdAt" | "employeeSalaryFrequency"
> & {
  credits: Pick<
    Credit,
    | "id"
    | "status"
    | "installationStatus"
    | "dispersedAt"
    | "loan"
    | "installationDate"
  >[]
}

export type CompanyCreditDetailedResponse = Pick<
  Credit,
  | "id"
  | "status"
  | "installationStatus"
  | "dispersedAt"
  | "loan"
  | "installationDate"
> & {
  borrower: {
    data: Pick<Credit["borrower"], "id" | "firstName" | "lastName">
  }
}

export type CompanyCreditDetailed = Pick<
  Credit,
  "id" | "loan" | "dispersedAt" | "installationStatus" | "installationDate"
> & {
  borrower: Pick<Credit["borrower"], "id" | "firstName" | "lastName">
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
          include: "credits",
          fields: {
            companies:
              "id,name,domain,createdAt,credits,employeeSalaryFrequency",
            credits:
              "id,status,installationStatus,dispersedAt,loan,installationDate",
          },
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
  CompanyCreditDetailed[] | undefined,
  string | undefined
>({
  key: "companyCreditsDetailedSelector",
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return undefined

      const api = get(apiSelector)
      const { data }: { data: CompanyCreditDetailedResponse[] } = await api.get(
        "credits",
        {
          params: {
            fields: {
              users: "id,firstName,lastName,email",
              credits:
                "id,status,installationStatus,dispersedAt,loan,installationDate,borrower",
            },
            include: "borrower",
            filter: {
              company: id,
              status: "dispersed",
            },
          },
        },
      )

      return data
        .filter((credit) => !credit.installationStatus)
        .sort((a, b) => {
          return (
            new Date(a.dispersedAt!).getTime() -
            new Date(b.dispersedAt!).getTime()
          )
        })
        .map((credit) => ({
          ...credit,
          borrower: credit.borrower.data,
        }))
    },
})

export const companyCreditsDetailedState = atomFamily({
  key: "companyCreditsDetailedState",
  default: companyCreditsDetailedSelector,
})

export const installedCreditSelectedState = atomFamily<boolean, string>({
  key: "installedCreditSelectedState",
  default: false,
})

export const selectedInstalledCreditIdsState = selectorFamily<string[], string>(
  {
    key: "selectedInstalledCreditIdsState",
    get:
      (companyId) =>
      ({ get }) => {
        const credits = get(companyCreditsDetailedSelector(companyId))
        return (
          credits
            ?.filter((credit) => get(installedCreditSelectedState(credit.id)))
            .map((credit) => credit.id) ?? []
        )
      },
  },
)
