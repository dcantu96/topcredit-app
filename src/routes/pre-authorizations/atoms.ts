import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"
import { selector } from "recoil"
import { User } from "src/schema.types"

type ApprovedUsersResponse = Pick<
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

export const approvedUsersSelectorQuery = selector<
  ReadonlyMap<number, ApprovedUsersResponse>
>({
  key: "approvedUsersSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get<ApprovedUsersResponse[]>("users", {
      params: {
        fields: {
          users:
            "createdAt,email,employeeNumber,firstName,id,lastName,salary,salaryFrequency",
        },
        filter: {
          status: "approved",
          byRole: "",
        },
      },
    })

    const basicDetailsMap = new Map<number, ApprovedUsersResponse>()
    for (const details of data) {
      basicDetailsMap.set(details.id, details)
    }
    return basicDetailsMap
  },
})

export const approvedUsersSortedSelector = selector<ApprovedUsersResponse[]>({
  key: "approvedUsersSortedSelector",
  get: ({ get }) => {
    const approvedUsersMap = get(approvedUsersSelectorQuery)
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
