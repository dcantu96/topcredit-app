import { atom, selector } from "recoil";
import { apiSelector } from "components/providers/api/atoms";
import { myProfileState } from "components/providers/auth/atoms";

interface GeneralDataResponse {
  addressLineOne: string | null;
  addressLineTwo: string | null;
  bankAccountNumber: string | null;
  city: string | null;
  country: string | null;
  employeeNumber: string | null;
  rfc: string | null;
  postalCode: number | null;
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
export const userGeneralDataQuerySelector = selector<
  GeneralDataResponse | undefined
>({
  key: "userGeneralDataQuerySelector",
  get: async ({ get }) => {
    const api = get(apiSelector);
    const { id } = get(myProfileState);
    console.log("id => profile", id);
    const { data } = await api.get(`users/${id}`);
    console.log(data);
    if (data)
      return {
        addressLineOne: data["address-line-one"],
        addressLineTwo: data["address-line-two"],
        bankAccountNumber: data["bank-account-number"],
        city: data["city"],
        country: data["country"],
        employeeNumber: data["employee-number"],
        rfc: data["rfc"],
        postalCode: data["postal-code"],
        state: data["state"],
        createdAt: data["created-at"],
        updatedAt: data["updated-at"],
      };
    return undefined;
  },
});

export const isGeneralDataCompleteSelector = selector({
  key: "isGeneralDataCompleteSelector",
  get: ({ get }) => {
    const generalData = get(userGeneralDataQuerySelector);
    if (!generalData) return false;
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
