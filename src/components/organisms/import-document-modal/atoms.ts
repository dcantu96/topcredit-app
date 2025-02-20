import { apiSelector } from "components/providers/api/atoms"
import { selector } from "recoil"

export const dispersedCreditsImportSelector = selector({
  key: "dispersedCreditsImportSelector",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const credits = await api.get("credits", {
      params: {
        include: "borrower,termOffering.term,payments",
        fields: {
          users: "id,employeeNumber",
          credits:
            "id,borrower,firstDiscountDate,hrStatus,termOffering,payments",
          payments: "id,amount,number,paidAt",
          termOfferings: "id,term",
          terms: "id,duration",
        },
        filter: {
          status: "dispersed",
          hrStatus: "approved",
        },
      },
    })
    return credits?.data
  },
})
