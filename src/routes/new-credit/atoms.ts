import { atom, selector } from "recoil"
import { apiSelector } from "components/providers/api/atoms"
import { myProfileState } from "components/providers/auth/atoms"
import { Credit, Term, TermOffering, User } from "src/schema.types"

type CreditWithoutBorrower = Omit<Credit, "borrower" | "termOffering"> & {
  termOffering: Pick<TermOffering, "id"> & {
    term: Pick<Term, "id" | "name" | "durationType" | "duration">
  }
}

/**
 * This query should return null if no credit is found
 *
 * If a credit is found, it should return the credit with the values
 *
 */
export const userGeneralDataQuerySelector = selector<User | undefined>({
  key: "userGeneralDataQuerySelector",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const profile = get(myProfileState)
    if (!profile) return undefined
    const { data }: { data: User } = await api.get(`users/${profile.id}`)
    return data
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
  CreditWithoutBorrower | undefined
>({
  key: "userLatestCreditSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const profile = get(myProfileState)
    if (!profile) return undefined
    const { data }: { data: CreditWithoutBorrower[] } = await api.get(
      `users/${profile.id}/credits`,
      {
        params: {
          sort: "-id",
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

type CreditWithTerm = CreditWithoutBorrower & {
  termOffering: Pick<TermOffering, "id"> & {
    term: Pick<Term, "id" | "name" | "durationType" | "duration">
  }
}

type CreditWithTermResponse = CreditWithoutBorrower & {
  termOffering: {
    data:
      | (Pick<TermOffering, "id"> & {
          term: {
            data: Pick<Term, "id" | "name" | "durationType" | "duration"> | null
          }
        })
      | null
  }
  payments: {
    data: Credit["payments"]
  }
}

export const userLatestAuthorizedCreditSelectorQuery = selector<
  CreditWithTerm | undefined
>({
  key: "userLatestAuthorizedCreditSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const profile = get(myProfileState)
    if (!profile) return undefined
    const { data }: { data: CreditWithTermResponse[] } = await api.get(
      `users/${profile.id}/credits`,
      {
        params: {
          sort: "-id",
          fields: {
            termOfferings: "id,term",
            terms: "id,name,durationType,duration",
          },
          filter: {
            status: "authorized,dispersed",
          },
          include: "termOffering.term,payments",
          page: {
            limit: 1,
            offset: 0,
          },
        },
      },
    )

    const credit = data?.[0]
    const termOffering = credit?.termOffering.data

    if (!credit || !termOffering || !termOffering.term.data) return undefined

    return {
      ...credit,
      termOffering: {
        ...termOffering,
        term: termOffering.term.data,
      },
      payments: credit.payments.data,
    }
  },
})

/**
 * if a credit is found, it should derive the step judging by the values of the credit
 *
 * if no credit is found, it should return "Datos Generales"
 */
export const initialActiveStep = selector<
  "Datos Generales" | "Pre Autorizado" | "Autorizado"
>({
  key: "initialActiveStep",
  get: ({ get }) => {
    const status = get(userGeneralDataQuerySelector)?.status
    const credit = get(userLatestCreditSelectorQuery)
    switch (status) {
      case null:
      case undefined:
      case "new":
      case "invalid-documentation":
      case "pending":
      case "pre-authorization":
        return "Datos Generales"
      default:
        break
    }
    switch (credit?.status) {
      case "new":
      case "pending":
      case "invalid-documentation":
        return "Pre Autorizado"
      case "authorized":
      case "dispersed":
        return "Autorizado"
      default:
        throw new Error("No credit found")
    }
  },
})

export const activeStepSelectorState = atom({
  key: "activeStepSelectorState",
  default: initialActiveStep,
})
