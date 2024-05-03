import { selector, selectorFamily } from "recoil"
import { apiSelector } from "components/providers/api/atoms"

import type { Role } from "../../schema.types"

export interface StaffUser {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
  roles: Role[]
}

export const staffListSelector = selector<StaffUser[]>({
  key: "staffListSelector",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.request({
      type: "users",
      url: "admin/staff",
    })
    return data
  },
})

export const staffSelector = selectorFamily<StaffUser, string>({
  key: "staffSelector",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data } = await api.request({
        type: "users",
        url: "admin/staff/" + id,
      })
      return data
    },
})
