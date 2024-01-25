import { atom, selector } from "recoil";
import { userFirstCreditQuerySelector } from "../../../atoms";
import {
  bankAccountNumberFieldValidation,
  postalCodeFieldValidation,
} from "./validations";

export const readonlyEmployeeNumberFieldSelector = selector<string | null>({
  key: "readonlyEmployeeNumberField",
  get: async ({ get }) => {
    const employee = get(userFirstCreditQuerySelector);
    return employee?.employeeNumber ?? null;
  },
});

export const editableEmployeeNumberFieldState = atom<string>({
  key: "editableEmployeeNumberField",
  default: selector<string>({
    key: "editableEmployeeNumberFieldDefault",
    get: ({ get }) => {
      const readOnlyEmployeeNumber = get(readonlyEmployeeNumberFieldSelector);
      return readOnlyEmployeeNumber ?? "";
    },
  }),
});

export const employeeNumberFieldTouchedState = atom<boolean>({
  key: "employeeNumberFieldTouched",
  default: false,
});

export const readonlyAddressLineOneFieldSelector = selector<string | null>({
  key: "readonlyAddressLineOneField",
  get: async ({ get }) => {
    const employee = get(userFirstCreditQuerySelector);
    return employee?.addressLineOne ?? null;
  },
});

export const editableAddressLineOneFieldState = atom<string>({
  key: "editableAddressLineOneField",
  default: selector<string>({
    key: "editableAddressLineOneFieldDefault",
    get: ({ get }) => {
      const readOnlyAddressLineOne = get(readonlyAddressLineOneFieldSelector);
      return readOnlyAddressLineOne ?? "";
    },
  }),
});

export const readonlyAddressLineTwoFieldSelector = selector<string | null>({
  key: "readonlyAddressLineTwoField",
  get: async ({ get }) => {
    const employee = get(userFirstCreditQuerySelector);
    return employee?.addressLineTwo ?? null;
  },
});

export const editableAddressLineTwoFieldState = atom<string>({
  key: "editableAddressLineTwoField",
  default: selector<string>({
    key: "editableAddressLineTwoFieldDefault",
    get: ({ get }) => {
      const readOnlyAddressLineTwo = get(readonlyAddressLineTwoFieldSelector);
      return readOnlyAddressLineTwo ?? "";
    },
  }),
});

export const readonlyCityFieldSelector = selector<string | null>({
  key: "readonlyCityField",
  get: async ({ get }) => {
    const employee = get(userFirstCreditQuerySelector);
    return employee?.city ?? null;
  },
});

export const editableCityFieldState = atom<string>({
  key: "editableCityField",
  default: selector<string>({
    key: "editableCityFieldDefault",
    get: ({ get }) => {
      const readOnlyCity = get(readonlyCityFieldSelector);
      return readOnlyCity ?? "";
    },
  }),
});

export const readonlyStateFieldSelector = selector<string | null>({
  key: "readonlyStateField",
  get: async ({ get }) => {
    const employee = get(userFirstCreditQuerySelector);
    return employee?.state ?? null;
  },
});

export const editableStateFieldState = atom<string>({
  key: "editableStateField",
  default: selector<string>({
    key: "editableStateFieldDefault",
    get: ({ get }) => {
      const readOnlyState = get(readonlyStateFieldSelector);
      return readOnlyState ?? "";
    },
  }),
});

export const readonlyCountryFieldSelector = selector<string | null>({
  key: "readonlyCountryField",
  get: async ({ get }) => {
    const employee = get(userFirstCreditQuerySelector);
    return employee?.country ?? null;
  },
});

export const editableCountryFieldState = atom<string>({
  key: "editableCountryField",
  default: selector<string>({
    key: "editableCountryFieldDefault",
    get: ({ get }) => {
      const readOnlyCountry = get(readonlyCountryFieldSelector);
      return readOnlyCountry ?? "";
    },
  }),
});

export const readonlyPostalCodeFieldSelector = selector<string | null>({
  key: "readonlyPostalCodeField",
  get: async ({ get }) => {
    const employee = get(userFirstCreditQuerySelector);
    return employee?.postalCode ?? null;
  },
});

export const editablePostalCodeFieldState = atom<string>({
  key: "editablePostalCodeField",
  default: selector<string>({
    key: "editablePostalCodeFieldDefault",
    get: ({ get }) => {
      const readOnlyPostalCode = get(readonlyPostalCodeFieldSelector);
      return readOnlyPostalCode ?? "";
    },
  }),
});

export const postalCodeFieldTouchedState = atom<boolean>({
  key: "postalCodeFieldTouched",
  default: false,
});

export const postalCodeFieldErrorsSelector = selector<string | false>({
  key: "postalCodeFieldErrors",
  get: ({ get }) => {
    const readOnlyPostalCode = get(readonlyPostalCodeFieldSelector);
    const touched = get(postalCodeFieldTouchedState);
    if (readOnlyPostalCode && !touched) {
      const error = postalCodeFieldValidation(readOnlyPostalCode);
      if (error) return error;
    }
    if (!touched) return false;

    const editablePostalCode = get(editablePostalCodeFieldState);
    const error = postalCodeFieldValidation(editablePostalCode);
    if (error) return error;
    return false;
  },
});

export const readonlyBankAccountNumberFieldSelector = selector<string | null>({
  key: "readonlyBankAccountNumberField",
  get: async ({ get }) => {
    const employee = get(userFirstCreditQuerySelector);
    return employee?.bankAccountNumber ?? null;
  },
});

export const editableBankAccountNumberFieldState = atom<string>({
  key: "editableBankAccountNumberField",
  default: selector<string>({
    key: "editableBankAccountNumberFieldDefault",
    get: ({ get }) => {
      const readOnlyBankAccountNumber = get(
        readonlyBankAccountNumberFieldSelector
      );
      return readOnlyBankAccountNumber ?? "";
    },
  }),
});

export const bankAccountNumberFieldTouchedState = atom<boolean>({
  key: "bankAccountNumberFieldTouched",
  default: false,
});

export const bankAccountNumberFieldErrorsSelector = selector<string | false>({
  key: "bankAccountNumberFieldErrors",
  get: ({ get }) => {
    const readOnlyBankAccountNumber = get(
      readonlyBankAccountNumberFieldSelector
    );
    const touched = get(bankAccountNumberFieldTouchedState);
    if (readOnlyBankAccountNumber && !touched) {
      const error = bankAccountNumberFieldValidation(readOnlyBankAccountNumber);
      if (error) return error;
    }
    if (!touched) return false;

    const editableBankAccountNumber = get(editableBankAccountNumberFieldState);
    const error = bankAccountNumberFieldValidation(editableBankAccountNumber);
    if (error) return error;
    return false;
  },
});
