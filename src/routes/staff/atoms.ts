import { atomFamily, selector, selectorFamily, useRecoilValue } from "recoil"
import { apiSelector } from "components/providers/api/atoms"

import type { Role } from "../../schema.types"
import useToast from "components/providers/toaster/useToast"
import { useNavigate } from "react-router-dom"

export interface StaffUser {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
  roles: Role[]
  hr_company_id: string
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

export const editableStaffState = atomFamily<StaffUser, string>({
  key: "editableStaffState",
  default: staffSelector,
})

export const useStaffActions = () => {
  const nav = useNavigate()
  const { success } = useToast()
  const api = useRecoilValue(apiSelector)

  const update = async (staff: StaffUser) => {
    await api.request({
      type: "users",
      url: "admin/staff/" + staff.id,
      method: "PATCH",
      body: staff,
    })
    success({
      message: "Staff actualizado",
      title: "Éxito",
      onClose() {
        nav("/dashboard/staff")
      },
    })
  }

  return { update }
}
