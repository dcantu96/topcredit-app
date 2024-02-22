import { atom, selector } from "recoil"
import { userGeneralDataQuerySelector } from "../../../atoms"
import {
  bankAccountNumberFieldValidation,
  postalCodeFieldValidation,
  rfcFieldValidation,
  salaryFieldValidation,
  salaryFrequencyFieldValidation,
} from "./validations"

export const readonlySalaryFrequencyFieldSelector = selector<string | null>({
  key: "readonlySalaryFrequencyField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.salaryFrequency?.toString() ?? null
  },
})

export const editableSalaryFrequencyFieldState = atom<string>({
  key: "editableSalaryFrequencyField",
  default: selector<string>({
    key: "editableSalaryFrequencyFieldDefault",
    get: ({ get }) => {
      const readOnlySalaryFrequency = get(readonlySalaryFrequencyFieldSelector)
      return readOnlySalaryFrequency ?? ""
    },
  }),
})

export const salaryFrequencyFieldTouchedState = atom<boolean>({
  key: "salaryFrequencyFieldTouched",
  default: false,
})

export const salaryFrequencyFieldErrorsSelector = selector<string | false>({
  key: "salaryFrequencyFieldErrors",
  get: ({ get }) => {
    const readOnlySalaryFrequency = get(readonlySalaryFrequencyFieldSelector)
    const touched = get(salaryFrequencyFieldTouchedState)
    if (readOnlySalaryFrequency && !touched) {
      const error = salaryFrequencyFieldValidation(readOnlySalaryFrequency)
      if (error) return error
    }
    if (!touched && !readOnlySalaryFrequency) return false

    const editableSalaryFrequency = get(editableSalaryFrequencyFieldState)
    const error = salaryFrequencyFieldValidation(editableSalaryFrequency)
    if (error) return error
    return false
  },
})

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
  get: async ({ get }) => {
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

export const readonlyStateFieldSelector = selector<string | null>({
  key: "readonlyStateField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.state ?? null
  },
})

export const editableStateFieldState = atom<string>({
  key: "editableStateField",
  default: selector<string>({
    key: "editableStateFieldDefault",
    get: ({ get }) => {
      const readOnlyState = get(readonlyStateFieldSelector)
      return readOnlyState ?? ""
    },
  }),
})

export const readonlyCountryFieldSelector = selector<string | null>({
  key: "readonlyCountryField",
  get: async ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector)
    return generalData?.country ?? null
  },
})

export const editableCountryFieldState = atom<string>({
  key: "editableCountryField",
  default: selector<string>({
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
