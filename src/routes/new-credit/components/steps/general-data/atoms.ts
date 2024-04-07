import { atom, selector } from "recoil"
import { userGeneralDataQuerySelector } from "../../../atoms"
import {
  bankAccountNumberFieldValidation,
  postalCodeFieldValidation,
  rfcFieldValidation,
  salaryFieldValidation,
} from "./validations"
import { ReadonlyFile } from "components/atoms/file-field/file-field"
import { StateOfMexico } from "src/schema.types"

export const readonlySalaryFieldSelector = selector<string | null>({
  key: "readonlySalaryField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.salary?.toString() ?? null
  },
})

export const editableSalaryFieldState = atom<string>({
  key: "editableSalaryField",
  default: selector<string>({
    key: "editableSalaryFieldDefault",
    get: ({ get }) => {
      const readOnlySalary = get(readonlySalaryFieldSelector)
      return readOnlySalary ?? ""
    },
  }),
})

export const salaryFieldTouchedState = atom<boolean>({
  key: "salaryFieldTouched",
  default: false,
})

export const salaryFieldErrorsSelector = selector<string | false>({
  key: "salaryFieldErrors",
  get: ({ get }) => {
    const readOnlySalary = get(readonlySalaryFieldSelector)
    const touched = get(salaryFieldTouchedState)
    if (readOnlySalary && !touched) {
      const error = salaryFieldValidation(readOnlySalary)
      if (error) return error
    }
    if (!touched && !readOnlySalary) return false

    const editableSalary = get(editableSalaryFieldState)
    const error = salaryFieldValidation(editableSalary)
    if (error) return error
    return false
  },
})

export const readonlyEmployeeNumberFieldSelector = selector<string | null>({
  key: "readonlyEmployeeNumberField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.employeeNumber ?? null
  },
})

export const editableEmployeeNumberFieldState = atom<string>({
  key: "editableEmployeeNumberField",
  default: selector<string>({
    key: "editableEmployeeNumberFieldDefault",
    get: ({ get }) => {
      const readOnlyEmployeeNumber = get(readonlyEmployeeNumberFieldSelector)
      return readOnlyEmployeeNumber ?? ""
    },
  }),
})

export const employeeNumberFieldTouchedState = atom<boolean>({
  key: "employeeNumberFieldTouched",
  default: false,
})

export const readonlyAddressLineOneFieldSelector = selector<string | null>({
  key: "readonlyAddressLineOneField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.addressLineOne ?? null
  },
})

export const editableAddressLineOneFieldState = atom<string>({
  key: "editableAddressLineOneField",
  default: selector<string>({
    key: "editableAddressLineOneFieldDefault",
    get: ({ get }) => {
      const readOnlyAddressLineOne = get(readonlyAddressLineOneFieldSelector)
      return readOnlyAddressLineOne ?? ""
    },
  }),
})

export const readonlyAddressLineTwoFieldSelector = selector<string | null>({
  key: "readonlyAddressLineTwoField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.addressLineTwo ?? null
  },
})

export const editableAddressLineTwoFieldState = atom<string>({
  key: "editableAddressLineTwoField",
  default: selector<string>({
    key: "editableAddressLineTwoFieldDefault",
    get: ({ get }) => {
      const readOnlyAddressLineTwo = get(readonlyAddressLineTwoFieldSelector)
      return readOnlyAddressLineTwo ?? ""
    },
  }),
})

export const readonlyCityFieldSelector = selector<string | null>({
  key: "readonlyCityField",
  get: ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.city ?? null
  },
})

export const editableCityFieldState = atom<string>({
  key: "editableCityField",
  default: selector<string>({
    key: "editableCityFieldDefault",
    get: ({ get }) => {
      const readOnlyCity = get(readonlyCityFieldSelector)
      return readOnlyCity ?? ""
    },
  }),
})

export const readonlyStateFieldSelector = selector<StateOfMexico | null>({
  key: "readonlyStateField",
  get: ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.state ?? null
  },
})

export const editableStateFieldState = atom<StateOfMexico | null>({
  key: "editableStateField",
  default: selector<StateOfMexico | null>({
    key: "editableStateFieldDefault",
    get: ({ get }) => {
      const readOnlyState = get(readonlyStateFieldSelector)
      return readOnlyState ?? null
    },
  }),
})

export const readonlyIdentityDocumentSelector = selector<
  ReadonlyFile | undefined
>({
  key: "readonlyIdentityDocumentSelector",
  get: ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    const url = generalData?.identityDocumentUrl
    const filename = generalData?.identityDocumentFilename
    const contentType = generalData?.identityDocumentContentType
    const size = generalData?.identityDocumentSize
    const uploadedAt = generalData?.identityDocumentUploadedAt
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

export const editableIdentityDocumentFieldState = atom<
  string | null | undefined
>({
  key: "editableIdentityDocumentField",
  default: undefined,
})

export const editableBankStatementFieldState = atom<string | null | undefined>({
  key: "editableBankStatementField",
  default: undefined,
})

export const readonlyBankStatementSelector = selector<ReadonlyFile | undefined>(
  {
    key: "readonlyBankStatementSelector",
    get: ({ get }) => {
      const generalData = get(userGeneralDataQuerySelector)
      const url = generalData?.bankStatementUrl
      const filename = generalData?.bankStatementFilename
      const contentType = generalData?.bankStatementContentType
      const size = generalData?.bankStatementSize
      const uploadedAt = generalData?.bankStatementUploadedAt
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
  },
)

export const editablePayrollReceiptFieldState = atom<string | null | undefined>(
  {
    key: "editablePayrollReceiptField",
    default: undefined,
  },
)

export const readonlyPayrollReceiptSelector = selector<
  ReadonlyFile | undefined
>({
  key: "readonlyPayrollReceiptSelector",
  get: ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    const url = generalData?.payrollReceiptUrl
    const filename = generalData?.payrollReceiptFilename
    const contentType = generalData?.payrollReceiptContentType
    const size = generalData?.payrollReceiptSize
    const uploadedAt = generalData?.payrollReceiptUploadedAt
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

export const editableProofOfAddressFieldState = atom<string | null | undefined>(
  {
    key: "editableProofOfAddressField",
    default: undefined,
  },
)

export const readonlyProofOfAddressSelector = selector<
  ReadonlyFile | undefined
>({
  key: "readonlyProofOfAddressSelector",
  get: ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    const url = generalData?.proofOfAddressUrl
    const filename = generalData?.proofOfAddressFilename
    const contentType = generalData?.proofOfAddressContentType
    const size = generalData?.proofOfAddressSize
    const uploadedAt = generalData?.proofOfAddressUploadedAt
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

// editableProofOfAddressFieldState
// readonlyProofOfAddressSelector

export const readonlyCountryFieldSelector = selector<"MX" | null>({
  key: "readonlyCountryField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.country ?? null
  },
})

export const editableCountryFieldState = atom<"MX">({
  key: "editableCountryField",
  default: selector<"MX">({
    key: "editableCountryFieldDefault",
    get: ({ get }) => {
      const readOnlyCountry = get(readonlyCountryFieldSelector)
      return readOnlyCountry ?? "MX"
    },
  }),
})

export const readonlyPostalCodeFieldSelector = selector<string | null>({
  key: "readonlyPostalCodeField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.postalCode?.toString() ?? null
  },
})

export const editablePostalCodeFieldState = atom<string>({
  key: "editablePostalCodeField",
  default: selector<string>({
    key: "editablePostalCodeFieldDefault",
    get: ({ get }) => {
      const readOnlyPostalCode = get(readonlyPostalCodeFieldSelector)
      return readOnlyPostalCode ?? ""
    },
  }),
})

export const postalCodeFieldTouchedState = atom<boolean>({
  key: "postalCodeFieldTouched",
  default: false,
})

export const postalCodeFieldErrorsSelector = selector<string | false>({
  key: "postalCodeFieldErrors",
  get: ({ get }) => {
    const readOnlyPostalCode = get(readonlyPostalCodeFieldSelector)
    const touched = get(postalCodeFieldTouchedState)
    if (readOnlyPostalCode && !touched) {
      const error = postalCodeFieldValidation(readOnlyPostalCode)
      if (error) return error
    }
    if (!touched) return false

    const editablePostalCode = get(editablePostalCodeFieldState)
    const error = postalCodeFieldValidation(editablePostalCode)
    if (error) return error
    return false
  },
})

export const readonlyBankAccountNumberFieldSelector = selector<string | null>({
  key: "readonlyBankAccountNumberField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.bankAccountNumber ?? null
  },
})

export const editableBankAccountNumberFieldState = atom<string>({
  key: "editableBankAccountNumberField",
  default: selector<string>({
    key: "editableBankAccountNumberFieldDefault",
    get: ({ get }) => {
      const readOnlyBankAccountNumber = get(
        readonlyBankAccountNumberFieldSelector,
      )
      return readOnlyBankAccountNumber ?? ""
    },
  }),
})

export const bankAccountNumberFieldTouchedState = atom<boolean>({
  key: "bankAccountNumberFieldTouched",
  default: false,
})

export const bankAccountNumberFieldErrorsSelector = selector<string | false>({
  key: "bankAccountNumberFieldErrors",
  get: ({ get }) => {
    const readOnlyBankAccountNumber = get(
      readonlyBankAccountNumberFieldSelector,
    )
    const editableBankAccountNumber = get(editableBankAccountNumberFieldState)
    const touched = get(bankAccountNumberFieldTouchedState)
    if (readOnlyBankAccountNumber && !touched) {
      if (readOnlyBankAccountNumber === editableBankAccountNumber) {
        const error = bankAccountNumberFieldValidation(
          readOnlyBankAccountNumber,
        )
        if (error) return error
      }
    }
    if (!touched && !readOnlyBankAccountNumber) return false

    const error = bankAccountNumberFieldValidation(editableBankAccountNumber)
    if (error) return error
    return false
  },
})

export const readonlyRFCFieldSelector = selector<string | null>({
  key: "readonlyRFCField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.rfc ?? null
  },
})

export const editableRFCFieldState = atom<string>({
  key: "editableRFCField",
  default: selector<string>({
    key: "editableRFCFieldDefault",
    get: ({ get }) => {
      const readOnlyRFC = get(readonlyRFCFieldSelector)
      return readOnlyRFC ?? ""
    },
  }),
})

export const RFCFieldTouchedState = atom<boolean>({
  key: "RFCFieldTouched",
  default: false,
})

export const RFCFieldErrorsSelector = selector<string | false>({
  key: "RFCFieldErrors",
  get: ({ get }) => {
    const readOnlyRFC = get(readonlyRFCFieldSelector)
    const editableRFC = get(editableRFCFieldState)
    const touched = get(RFCFieldTouchedState)
    if (readOnlyRFC && !touched) {
      if (readOnlyRFC === editableRFC) {
        const error = rfcFieldValidation(readOnlyRFC)
        if (error) return error
      }
    }
    if (!touched && !readOnlyRFC) return false

    const error = rfcFieldValidation(editableRFC)
    if (error) return error
    return false
  },
})
