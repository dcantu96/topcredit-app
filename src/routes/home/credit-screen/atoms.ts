import { apiSelector } from "components/providers/api/atoms";
import { myProfileState } from "components/providers/auth/atoms";
import { atom, selector } from "recoil";

/**
 * This query should return null if no credit is found
 *
 * If a credit is found, it should return the credit with the values
 *
 */
export const userFirstCreditQuerySelector = selector({
  key: "userFirstCreditQuerySelector",
  get: async ({ get }) => {
    const api = get(apiSelector);
    const { id } = get(myProfileState);
    const response = await api.get(`users/${id}`);
    console.log("userFirstCreditQuerySelector", response);
    return undefined;
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
    const firstCredit = get(userFirstCreditQuerySelector);
    if (!firstCredit) return "Datos Generales";
    return "Another State";
  },
});

export const activeStepSelectorState = atom({
  key: "activeStepSelectorState",
  default: initialActiveStep,
});
