import { atom, selector } from "recoil";
import { apiSelector } from "components/providers/api/atoms";
import { myProfileState } from "components/providers/auth/atoms";

interface GeneralDataResponse {
  id: string;
  salaryFrequency: string | null;
  salary: number | null;
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

interface UserGeneralDataQuery {
  id: string;
  "employee-number": string;
  "bank-account-number": string;
  "address-line-one": string;
  "address-line-two": string;
  city: string;
  state: string;
  country: string;
  rfc: string;
  salary: number;
  "salary-frequency": string;
  "postal-code": number;
  "created-at": string;
  "updated-at": string;
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
    const { data } = await api.get<UserGeneralDataQuery>(`users/${id}`);
    console.log(data);
    if (data)
      return {
        id: data.id,
        addressLineOne: data["address-line-one"],
        addressLineTwo: data["address-line-two"],
        bankAccountNumber: data["bank-account-number"],
        city: data["city"],
        country: data["country"],
        employeeNumber: data["employee-number"],
        rfc: data["rfc"],
        postalCode: data["postal-code"],
        state: data["state"],
        salary: data["salary"],
        salaryFrequency: data["salary-frequency"],
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
