import { atom, selector } from "recoil"
import { apiSelector } from "components/providers/api/atoms"
import { myProfileState } from "components/providers/auth/atoms"

interface GeneralDataResponse {
  id: string
  salaryFrequency: string | null
  salary: number | null
  addressLineOne: string | null
  addressLineTwo: string | null
  bankAccountNumber: string | null
  city: string | null
  country: string | null
  employeeNumber: string | null
  rfc: string | null
  postalCode: number | null
  status:
    | "new"
    | "pending"
    | "invalid-documentation"
    | "pre-authorization"
    | "pre-authorized"
    | "denied"
    | null
  state: string | null
  createdAt: string
  updatedAt: string
}

interface UserGeneralDataQuery {
  id: string
  employeeNumber: string
  bankAccountNumber: string
  addressLineOne: string
  addressLineTwo: string
  city: string
  state: string
  status: string
  country: string
  rfc: string
  salary: number
  salaryFrequency: string
  postalCode: number
  createdAt: string
  updatedAt: string
}

/**
 * This query should return null if no credit is found
 *
 * If a credit is found, it should return the credit with the values
 *
 */
export const userGeneralDataQuerySelector = selector<
  GeneralDataResponse | undefined
>({
  key: "userGeneralDataQuerySelector",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const profile = get(myProfileState)
    if (!profile) return undefined
    const { data } = await api.get<UserGeneralDataQuery>(`users/${profile.id}`)
    return data as GeneralDataResponse
  },
})

export const isGeneralDataCompleteSelector = selector({
  key: "isGeneralDataCompleteSelector",
  get: ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    if (!generalData) return false
    if (
      !generalData.addressLineOne ||
      !generalData.bankAccountNumber ||
      !generalData.city ||
      !generalData.rfc ||
      !generalData.country ||
      !generalData.employeeNumber ||
      !generalData.postalCode ||
      !generalData.state
    )
      return false
    return true
  },
})

/**
 * if a credit is found, it should derive the step judging by the values of the credit
 *
 * if no credit is found, it should return "Datos Generales"
 */
export const initialActiveStep = selector<string>({
  key: "initialActiveStep",
  get: ({ get }) => {
    const isGeneralDataComplete = get(isGeneralDataCompleteSelector)
    if (!isGeneralDataComplete) return "Datos Generales"
    const status = get(userGeneralDataQuerySelector)?.status
    if (status === "new") return "Datos Generales"
    if (status === "invalid-documentation") return "Datos Generales"
    if (status === "pending" || status === "pre-authorization")
      return "Datos Generales"
    if (status === "pre-authorized") return "Pre Autorizado"
    return "Autorizado"
  },
})

export const activeStepSelectorState = atom({
  key: "activeStepSelectorState",
  default: initialActiveStep,
})
