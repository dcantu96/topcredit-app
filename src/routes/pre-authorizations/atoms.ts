import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"
import { selector } from "recoil"
import { Company, Term, User } from "src/schema.types"

export type PreAuthorizationUsersResponse = Pick<
  User,
  | "createdAt"
  | "email"
  | "employeeNumber"
  | "firstName"
  | "id"
  | "lastName"
  | "salary"
  | "salaryFrequency"
>

// 1. Employee Number
// 2. Full Name
// 3. Docs
// 4. salary (frequency)
// 5. company
// 6. input for loan amount (warning message if it's more than max loan amount, which is calculated based on the company max loan amount and the user's salary)
// 7. input for loan term (terms are available based on the company's loan terms)

export const preAuthorizationUsersSelectorQuery = selector<
  ReadonlyMap<string, PreAuthorizationUsersResponse>
>({
  key: "preAuthorizationUsersSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get<PreAuthorizationUsersResponse[]>("users", {
      params: {
        fields: {
          users:
            "createdAt,email,employeeNumber,firstName,id,lastName,salary,salaryFrequency",
        },
        filter: {
          status: "pre-authorization",
          byRole: "",
        },
      },
    })

    const map = new Map<string, PreAuthorizationUsersResponse>()
    for (const user of data) {
      map.set(user.id, user)
    }
    return map
  },
})

export const preAuthorizationUsersSortedSelector = selector<
  PreAuthorizationUsersResponse[]
>({
  key: "approvedUsersSortedSelector",
  get: ({ get }) => {
    const approvedUsersMap = get(preAuthorizationUsersSelectorQuery)
    const sortOrder = get(listSortOrderState("pre-authorizations")) ?? "asc"
    return Array.from(approvedUsersMap.values()).toSorted((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  },
  set: (_, newValue) => newValue,
})

type CompanyForPreAuthResponse = Pick<
  Company,
  "borrowingCapacity" | "id" | "domain" | "rate"
> & {
  terms: {
    data: Term[]
  }
}

export const companiesForPreAuthSelectorQuery = selector<
  Map<
    string,
    { borrowingCapacity: number | null; terms: Term[]; rate: number | null }
  >
>({
  key: "companiesForPreAuthSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get<CompanyForPreAuthResponse[]>("companies", {
      params: {
        fields: {
          companies: "borrowingCapacity,id,domain,terms,rate",
        },
        include: "terms",
      },
    })

    const map = new Map<
      string,
      { borrowingCapacity: number | null; terms: Term[]; rate: number | null }
    >()
    for (const company of data) {
      map.set(company.domain, {
        borrowingCapacity: company.borrowingCapacity,
        terms: company.terms.data,
        rate: company.rate,
      })
    }
    return map
  },
})
