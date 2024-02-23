import { apiSelector } from "components/providers/api/atoms"
import { atom, selector, selectorFamily } from "recoil"
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
  ReadonlyMap<number, BasicDetailsTableResponse>
>({
  key: "basicDetailsListSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get<BasicDetailsTableResponse[]>("users", {
      params: {
        fields: {
          users:
            "employeeNumber,rfc,salary,salaryFrequency,firstName,lastName,email,createdAt,state",
        },
        filter: {
          byRole: "",
        },
      },
    })

    const basicDetailsMap = new Map<number, BasicDetailsTableResponse>()
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
      const sortOrder = get(basicDetailsSortOrderAtom) ?? "asc"
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

export const basicDetailsSortOrderAtom = atom<"asc" | "desc" | undefined>({
  key: "basicDetailsSortOrderAtom",
  default: undefined,
})

export const basicDetailsSelector = selectorFamily<User | undefined, number>({
  key: "requestSelector",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data } = await api.get<User>(`users/${id}`)
      return data
    },
})
