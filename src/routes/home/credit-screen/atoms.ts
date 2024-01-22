import { apiSelector } from "components/providers/api/atoms";
import { myProfileState } from "components/providers/auth/atoms";
import { atom, selector } from "recoil";

interface CreditResponse {
  addressLineOne: string | null;
  addressLineTwo: string | null;
  bankAccountNumber: string | null;
  city: string | null;
  country: string | null;
  employeeNumber: string | null;
  postalCode: string | null;
  state: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * This query should return null if no credit is found
 *
 * If a credit is found, it should return the credit with the values
 *
 */
export const userFirstCreditQuerySelector = selector<
  CreditResponse | undefined
>({
  key: "userFirstCreditQuerySelector",
  get: async ({ get }) => {
    const api = get(apiSelector);
    const { id } = get(myProfileState);
    const { data } = await api.get(`users/${id}/credits`);
    console.log("userFirstCreditQuerySelector", data);
    if (data && data.length > 0)
      return {
        addressLineOne: data[0]["address-line-one"],
        addressLineTwo: data[0]["address-line-two"],
        bankAccountNumber: data[0]["bank-account-number"],
        city: data[0]["city"],
        country: data[0]["country"],
        employeeNumber: data[0]["employee-number"],
        postalCode: data[0]["postal-code"],
        state: data[0]["state"],
        createdAt: data[0]["created-at"],
        updatedAt: data[0]["updated-at"],
      };
    return undefined;
  },
});

export const isGeneralDataCompleteSelector = selector({
  key: "isGeneralDataCompleteSelector",
  get: ({ get }) => {
    const firstCredit = get(userFirstCreditQuerySelector);
    if (!firstCredit) return false;
    if (
      !firstCredit.addressLineOne ||
      !firstCredit.bankAccountNumber ||
      !firstCredit.city ||
      !firstCredit.country ||
      !firstCredit.employeeNumber ||
      !firstCredit.postalCode ||
      !firstCredit.state
    )
      return false;
    return true;
  },
});

/**
 * if a credit is found, it should derive the step judging by the values of the credit
 *
 * if no credit is found, it should return "Datos Generales"
 */
export const initialActiveStep = selector<string>({
  key: "initialActiveStep",
  get: ({ get }) => {
    const isGeneralDataComplete = get(isGeneralDataCompleteSelector);
    if (!isGeneralDataComplete) return "Datos Generales";
    return "Another State";
  },
});

export const activeStepSelectorState = atom({
  key: "activeStepSelectorState",
  default: initialActiveStep,
});
