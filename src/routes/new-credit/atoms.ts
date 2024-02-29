import { atom, selector } from "recoil"
import { apiSelector } from "components/providers/api/atoms"
import { myProfileState } from "components/providers/auth/atoms"
import { CreditStatus, UserStatus } from "src/schema.types"

interface UserGeneralDataQuery {
  id: string
  employeeNumber: string
  bankAccountNumber: string
  addressLineOne: string
  addressLineTwo: string
  city: string
  state: string
  status: UserStatus | null
  country: string
  rfc: string
  salary: number
  salaryFrequency: string
  postalCode: number
  createdAt: string
  updatedAt: string
}

interface UserCreditQuery {
  id: string
  status: CreditStatus
  loan: number
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
  UserGeneralDataQuery | undefined
>({
  key: "userGeneralDataQuerySelector",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const profile = get(myProfileState)
    if (!profile) return undefined
    const { data } = await api.get<UserGeneralDataQuery>(`users/${profile.id}`)
    return data as UserGeneralDataQuery
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
 * This query should return null if no credit is found
 *
 * If a credit is found, it should return the credit with the values
 *
 */
export const userLatestCreditSelectorQuery = selector<
  UserCreditQuery | undefined
>({
  key: "userLatestCreditSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const profile = get(myProfileState)
    if (!profile) return undefined
    const { data } = await api.get<UserCreditQuery[]>(
      `users/${profile.id}/credits`,
      {
        params: {
          sort: "-id",
          filter: {
            status: "new,pending,invalid-documentation",
          },
          page: {
            limit: 1,
            offset: 0,
          },
        },
      },
    )

    return data?.[0]
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
    const status = get(userGeneralDataQuerySelector)?.status
    const credit = get(userLatestCreditSelectorQuery)
    if (!status || status === "new") return "Datos Generales"
    if (status === "invalid-documentation") return "Datos Generales"
    if (status === "pending" || status === "pre-authorization")
      return "Datos Generales"
    if (credit?.status === "new") return "Pre Autorizado"
    if (credit?.status === "pending") return "Pre Autorizado"
    if (credit?.status === "invalid-documentation") return "Pre Autorizado"
    else return "Autorizado"
  },
})

export const activeStepSelectorState = atom({
  key: "activeStepSelectorState",
  default: initialActiveStep,
})
