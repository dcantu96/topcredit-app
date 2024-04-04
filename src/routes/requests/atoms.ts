import { listSortOrderState } from "components/hocs/with-sort-order/atoms"
import { apiSelector } from "components/providers/api/atoms"
import { selector, selectorFamily } from "recoil"
import { User } from "src/schema.types"

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
  | "salaryFrequency"
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
              "employeeNumber,rfc,salary,salaryFrequency,firstName,lastName,email,createdAt,state",
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
