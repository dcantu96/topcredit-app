// creditContractState
// readonlyCreditContractSelector
// creditAuthorizationState
// readonlyCreditAuthorizationSelector

import { ReadonlyFile } from "components/atoms/file-field/file-field"
import { atom, selector } from "recoil"
import { userLatestCreditSelectorQuery } from "../../../../new-credit/atoms"

export const creditPayrollReceiptState = atom<string | null | undefined>({
  key: "creditPayrollReceiptState",
  default: undefined,
})

export const readonlyCreditPayrollReceiptSelector = selector<
  ReadonlyFile | undefined
>({
  key: "readonlyCreditPayrollReceiptSelector",
  get: ({ get }) => {
    const credit = get(userLatestCreditSelectorQuery)
    const url = credit?.payrollReceiptUrl
    const filename = credit?.payrollReceiptFilename
    const contentType = credit?.payrollReceiptContentType
    const size = credit?.payrollReceiptSize
    const uploadedAt = credit?.payrollReceiptUploadedAt
    if (url && filename && contentType && size && uploadedAt) {
      return {
        url,
        filename,
        contentType,
        size,
        uploadedAt,
      }
    } else {
      return undefined
    }
  },
})

export const creditContractState = atom<string | null | undefined>({
  key: "creditContractState",
  default: undefined,
})

export const readonlyCreditContractSelector = selector<
  ReadonlyFile | undefined
>({
  key: "readonlyCreditContractSelector",
  get: ({ get }) => {
    const credit = get(userLatestCreditSelectorQuery)
    const url = credit?.contractUrl
    const filename = credit?.contractFilename
    const contentType = credit?.contractContentType
    const size = credit?.contractSize
    const uploadedAt = credit?.contractUploadedAt
    if (url && filename && contentType && size && uploadedAt) {
      return {
        url,
        filename,
        contentType,
        size,
        uploadedAt,
      }
    } else {
      return undefined
    }
  },
})

export const creditAuthorizationState = atom<string | null | undefined>({
  key: "creditAuthorizationState",
  default: undefined,
})

export const readonlyCreditAuthorizationSelector = selector<
  ReadonlyFile | undefined
>({
  key: "readonlyCreditAuthorizationSelector",
  get: ({ get }) => {
    const credit = get(userLatestCreditSelectorQuery)
    const url = credit?.authorizationUrl
    const filename = credit?.authorizationFilename
    const contentType = credit?.authorizationContentType
    const size = credit?.authorizationSize
    const uploadedAt = credit?.authorizationUploadedAt
    if (url && filename && contentType && size && uploadedAt) {
      return {
        url,
        filename,
        contentType,
        size,
        uploadedAt,
      }
    } else {
      return undefined
    }
  },
})
