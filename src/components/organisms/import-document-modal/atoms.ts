import { apiSelector } from "components/providers/api/atoms"
import { selectorFamily } from "recoil"

export const dispersedCreditsImportSelector = selectorFamily({
  key: "dispersedCreditsImportSelector",
  get:
    (companyId: string) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const credits = await api.get("credits", {
        params: {
          include: "borrower,termOffering.term,payments",
          fields: {
            users: "id,employeeNumber,firstName,lastName",
            credits:
              "id,borrower,firstDiscountDate,hrStatus,termOffering,payments,amortization",
            payments: "id,amount,number,paidAt",
            termOfferings: "id,term",
            terms: "id,duration",
          },
          filter: {
            company: companyId,
            status: "dispersed",
          },
        },
      })
      return credits?.data
    },
})
